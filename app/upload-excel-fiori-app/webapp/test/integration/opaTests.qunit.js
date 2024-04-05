sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'uploadexcelfioriapp/test/integration/FirstJourney',
		'uploadexcelfioriapp/test/integration/pages/StudentDetailsList',
		'uploadexcelfioriapp/test/integration/pages/StudentDetailsObjectPage'
    ],
    function(JourneyRunner, opaJourney, StudentDetailsList, StudentDetailsObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('uploadexcelfioriapp') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheStudentDetailsList: StudentDetailsList,
					onTheStudentDetailsObjectPage: StudentDetailsObjectPage
                }
            },
            opaJourney.run
        );
    }
);