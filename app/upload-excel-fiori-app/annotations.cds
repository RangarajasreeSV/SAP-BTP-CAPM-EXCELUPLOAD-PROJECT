using UploadExcelSrv as service from '../../srv/Upload-Srv';
     
annotate service.StudentDetails with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'StudentId',
            Value : StudentId,
        },
        {
            $Type : 'UI.DataField',
            Label : 'StudentName',
            Value : StudentName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Address',
            Value : Address,
        },
        {
            $Type : 'UI.DataField',
            Label : 'PhoneNumber',
            Value : PhoneNumber,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Grade',
            Value : Grade,
        },
    ]
);
annotate service.StudentDetails with @(
    UI.FieldGroup #GeneratedGroup1 : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'StudentId',
                Value : StudentId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'StudentName',
                Value : StudentName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Address',
                Value : Address,
            },
            {
                $Type : 'UI.DataField',
                Label : 'PhoneNumber',
                Value : PhoneNumber,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Grade',
                Value : Grade,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup1',
        },
    ]
);
