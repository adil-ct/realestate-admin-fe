const copyStringToClipboard = function (str) {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style = { position: "absolute", left: "-9999px" };
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
};

const facilityMergeFields = [
    "FacilityNumber",
    "FacilityName",
    "Address",
    "MapCategory",
    "Latitude",
    "Longitude",
    "ReceivingPlant",
    "TrunkLine",
    "SiteElevation",
  ];
  const inspectionMergeFields = ["InspectionCompleteDate", "InspectionEventType"];
  const createOptionGroupElement = (mergeFields, optionGrouplabel) => {
    const optionGroupElement = document.createElement("optgroup");
    optionGroupElement.setAttribute("label", optionGrouplabel);
    for (let index = 0; index < mergeFields.length; index+=1) {
      const optionElement = document.createElement("option");
      optionElement.setAttribute("class", "merge-field-select-option");
      optionElement.setAttribute("value", mergeFields[index]);
      optionElement.text = mergeFields[index];
      optionGroupElement.appendChild(optionElement);
    }
    return optionGroupElement;
};

const buttons = [
    "undo",
    "redo",
    "|",
    "bold",
    "strikethrough",
    "underline",
    "italic",
    "|",
    "align",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "link",
    "table",
    "|",
    "eraser",
    "copyformat",
    "|",
    {
      name: "insertMergeField",
      tooltip: "Insert Merge Field",
      iconURL: "images/merge.png",
      popup: (editor) => {
        function onSelected(e) {
          const mergeField = e.target.value;
          if (mergeField) {           
            editor.selection.insertNode(
              editor.create.inside.fromHTML(`{{${mergeField}}}`)
            );
          }
        }
        const divElement = editor.create.div("merge-field-popup");
  
        const labelElement = document.createElement("label");
        labelElement.setAttribute("class", "merge-field-label");
        labelElement.text = "Merge field: ";
        divElement.appendChild(labelElement);
  
        const selectElement = document.createElement("select");
        selectElement.setAttribute("class", "merge-field-select");
        selectElement.appendChild(
          createOptionGroupElement(facilityMergeFields, "Facility")
        );
        selectElement.appendChild(
          createOptionGroupElement(inspectionMergeFields, "Inspection")
        );
        selectElement.onchange = onSelected;
        divElement.appendChild(selectElement);  

        return divElement;
      },
    },
    {
      name: "copyContent",
      tooltip: "Copy HTML to Clipboard",
      iconURL: "images/copy.png",
      exec: (editor) => {
        const html = editor.value;
        copyStringToClipboard(html);
      },
    },
];

export const editorConfig = {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: "en",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    buttons,
    uploader: {
      insertImageAsBase64URI: true,
    },
    width: "auto",
    height: 400,
    placeholder: "Enter description",
};