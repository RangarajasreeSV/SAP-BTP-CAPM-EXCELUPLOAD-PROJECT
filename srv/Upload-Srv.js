const cds = require('@sap/cds');
const { PassThrough } = require('stream');
var xlsx = require("xlsx");
module.exports = async srv => {

    /**
     * event hander 
     * PUT - uploading the data
     * UploadExcel - service level entity which holds the upload data structure
     * req is the request of the event
     * spreadsheet is the element of UploadExcel entity
     * arrBuffer[] holds the data chunks
     *  req.headers Provides access to headers of the event message or request
     * req.headers.slug =  In the case of asynchronous event messages, 
              it's the headers information sent by the event source. 
             slug : When uploading files using sap.ui.unified.FileUploaderParameter() component,
             if we need to pass aditional information it's necessary to use a parameter called SLUG.
          To define this parameter value we use the component sap.ui.unified.FileUploaderParameter().
             like name.setName('slug');

         Stream :
          require('stream') 
          This is node.js package installed using npm i readable-stream
          A stream is an abstract interface for working with streaming data in Node.js
          It has writable,readable,pipeline and etc., classes and functions
        require('stream').PassThrough() 
        PassThrough() Sometimes, you need to manipulate or inspect the data as it passes from one stream to another, but you don’t actually want to change it in any way. That’s when you would use a stream.PassThrough() instance
 
        The pipe() method makes sure that data is not read from the source faster than it can be written to the destination.

         stream.on()
        event listener 1 : 'data' , which is emitted when data is available to read and push to a empty array called 'buffers[]'
        When the “data” event is emitted, the callback function creates chunk of data dataChunk and get pushed to buffers array
        event listener 2 :  “end” event, which is emitted when the stream has reached the end of the data.


     */

    srv.on('PUT', "UploadExcel", async (req, next) => {
        if (req.data.spreadsheet) {
    
            var table = req.headers.slug;
            const sStream = new PassThrough();
            var arrBuffer = [];
            req.data.spreadsheet.pipe(sStream);
            await new Promise((resolve, reject) => {
                sStream.on('data', Chunk => {
                    // to convert data from PassThrough stream into ArrayBuffer
                    arrBuffer.push(Chunk);

                });
                sStream.on('end', async () => {
                    var buffer = Buffer.concat(arrBuffer);
                    //workbook holds the excel data format
                    var workbook = xlsx.read(buffer, { header: 1, cellDates: true });
                    //data[] to hold the records
                    let data = []

                    //sheets Holds the No of sheets exist in the Workbook
                    const sheets = workbook.SheetNames
                    for (let i = 0; i < sheets.length; i++) {
                        //temp holds the excel data in the json object format
                        const temp = xlsx.utils.sheet_to_json(
                            workbook.Sheets[workbook.SheetNames[0]], { header: 1 });

                        for (let i = 1; i < temp.length; i++) {
                            for (var j = 1; j <= 5; j++) {
                                if (temp[i][j] == undefined)
                                    temp[i][j] = "";

                                temp[i][j] = temp[i][j];

                            }
                        }
                        for (let b = 1; b < temp.length; b++) {

                            try {
                                // oDataObj holds the each [row][column] values
                                var oDataObj = {
                                    "StudentId": temp[b][0].toString(),
                                    "StudentName": temp[b][1].toString(),
                                    "Address": temp[b][2].toString(),
                                    "PhoneNumber": temp[b][3].toString(),
                                    "Grade": temp[b][4].toString()
                                }

                            } catch (err) {
                                console.log("error %s", err);
                            }
                            //pushing oDataObj to data[]
                            data.push(oDataObj);
                        }


                    }
                    //if there's any data , EntityCall() will be called
                    if (data) {
                        const callResponse = await EntityCall("StudentDetails", data, req);
                        if (callResponse == -1)
                            reject(req.error(400, JSON.stringify(data)));
                        else {
                            resolve(req.notify({
                                message: 'Upload Successful',
                                status: 200
                            }));
                        }
                    }
                });
            });

        } else {
            return next();
        }
    });
/**
 * EntityCall() to Insert the data
 * @param {*} table : StudentDetails table in which data is inserted
 * @param {*} data : data values object
 * @returns : insertResult
 */
    async function EntityCall(table, data, req) {
        const selQuery = SELECT.from(table);
        const eSrv = await cds.connect.to('UploadExcelSrv');
        const runSelQuery = await eSrv.run(selQuery);
        try {

            const insertQuery = INSERT.into(table).entries(data);
            const insertResult = await eSrv.run(insertQuery);
            return insertResult;

        } catch (err) {
            console.log("Error %s", err);
        }
    }


}