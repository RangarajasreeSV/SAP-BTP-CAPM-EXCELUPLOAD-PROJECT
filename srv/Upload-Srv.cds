using {upload.excel as db} from '../db/Upload-Schema';


service UploadExcelSrv {

    // Entity to store uploaded excel data
    @cds.persistence.skip
    @odata.singleton
    entity UploadExcel {
        @Core.MediaType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        spreadsheet : LargeBinary;
    };
     
     
    entity StudentDetails as projection on db.StudentDetails;

}
