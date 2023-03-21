import { Editor } from '@tinymce/tinymce-react';

let help = null
export let StoryEdi = <Editor
    apiKey='ytocjza1m3x9z3yic70089bvsm768v7ty4htmbg2wm2jc4jv'
    disabled = {true}
    inline = {false}
    
    init={{
      selector: "#storyEdi",
      height: 500,
      menubar: false,
      placeholder: "Whats on your mind?",
      /*init_instance_callback : function(editor) {
        if (help == null) {
          editor.setContent("EMPTY ENTRY");
        }
        else {
            editor.setContent(entryArray);}*/

      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
      ],
      toolbar:  'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    }}
    />