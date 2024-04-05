//register the required components
sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
], function (Fragment, MessageBox, MessageToast) {

    "use strict";
  
    var fragmentLoad; // fragmentLoad for Loading the Fragment element
    /**
     * closeFrag() is for Closing logic of fragment 
     * called when the dialog needs to be closed
     */

    function closeFrag() {
        fragmentLoad.close();
        fragmentLoad.destroy();
        fragmentLoad = undefined;
    };

    /**
     * calltoUpload() is called to display the status of the upload
     * if the respose code is 204 , it will display message 
     * otherwise , displays the error message 
     */
    function calltoUpload(oEvent,sStat,uploadResponse){
     var that = oEvent;
     var oModel = that._view.getModel();
     var oExcelList = oModel.bindList("/StudentDetails");

    if(sStat === 204){
         oExcelList.requestContexts(0).then(function (oContext) {
         const Message = "Successfully uploaded ";
         MessageBox.success(Message);
         oModel.refresh();
         that._view.setBusy(false);
     });
    }else{
      MessageBox.error("Error Occured");
      that._view.setBusy(false);
    }
    }
    return {
      /**
       * onUploadPress() is called on triggering the "Upload" button registerd in manifest.json
       *
       */
        onUploadPress: function (oEvent) {
           // MessageToast.show("triggered");
            var oModel = this._view.getModel();
            var aFragment = "uploadexcelfioriapp.ext.fragment.UploadExcel";
            fragmentLoad = Fragment.load({ id: this._view.getId(), name: aFragment, controller: this });
            fragmentLoad.then(function (oResponse) {
                this._timeline = this.byId(Fragment.createId(this._view.getId(), "uploadexceldialog"));
                fragmentLoad = oResponse;
                fragmentLoad.setModel(oModel);
                fragmentLoad.open();
            }.bind(this));

        },
        /**
         * onUpload() is called when "Upload" button triggered registered in the fragment.xml
         */
         onUpload : function(oEvent){
            this._view.setBusy(true);
            var aFileUploader = sap.ui.getCore().byId("uploadexcelfioriapp::StudentDetailsList--uploader");
            //Represents a parameter for the FileUploader which is rendered as a hidden inputfield.
            var headerPar = new sap.ui.unified.FileUploaderParameter();
            headerPar.setName('slug');
            headerPar.setValue("StudentDetails");
            aFileUploader.destroyHeaderParameters();
            aFileUploader.addHeaderParameter(headerPar);

            //when user doesn't select file and tries to upload 
            if(aFileUploader.oFileUpload.title === 'No file chosen'){
              MessageBox.error("No File Chosen");
              this._view.setBusy(false);
              return;
            }
              aFileUploader
                .checkFileReadable()
                .then(function () {
                    aFileUploader.upload();
                    fragmentLoad.close();
                })
                .catch(function (error) {
                    MessageBox.error(error);
                    this._view.setBusy(false);
                    closeFrag();
                }.bind(this));
         },
 /**
  * onCancel() is called when cancel button is triggered (registered in fragment.xml end button)
  */
        onCancel :function(){
           closeFrag();
        },

        /**
         * This function calls the calltoUpload() with status code after the upload complete 
         * 
         */
        onUploadComplete: function(oResp){
          var sStat = oResp.getParameter("status");
          this._view.setBusy(false);
          calltoUpload(this,sStat,oResp);
          closeFrag();
        }
    }


});