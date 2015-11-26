var React = require("react");
var ReactDOM = require("react-dom");
var Button = require("react-bootstrap/lib/Button");
var Modal = require("react-bootstrap/lib/Modal");
var Input = require("react-bootstrap/lib/Input");
var ButtonGroup = require("react-bootstrap/lib/ButtonGroup");
var ButtonToolbar = require("react-bootstrap/lib/ButtonToolbar");
var ButtonInput = require("react-bootstrap/lib/ButtonInput");
var ImageUploadModal = require("./modals.jsx").ImageUploadModal;
var AddLinkModal = require("./modals.jsx").AddLinkModal;
var CommentModal = require("./modals.jsx").CommentModal;

var FormatPanel = React.createClass({ // The buttons used to interact with editor
  handleEvent: function(fn){
    this.props.onEvent(fn); // fn will be passed to the editor for event dispathing
  },
  render: function() {
    return (
          <ButtonToolbar>
              <ButtonGroup bsSize="xs">
                  <FormatButton fa="fa-italic" tag="*" name="italic" bsSize="small" onEvent={this.handleEvent}/>
                  <FormatButton fa="fa-bold" tag="**" name="bold" bsSize="small" onEvent={this.handleEvent}/>
                  <FormatButton fa="fa-subscript" tag="<sub>" name="sub" bsSize="small" onEvent={this.handleEvent}/>
                  <FormatButton fa="fa-superscript" tag="<sup>" name="super" bsSize="small" onEvent={this.handleEvent}/>
                  <FormatButton fa="fa-underline" tag="<underline>" name="underline" bsSize="small" onEvent={this.handleEvent}/>
              </ButtonGroup>
              <ButtonGroup bsSize="xs">
                <ImageUploadModal onEvent={this.handleEvent}/>
                <AddLinkModal onEvent={this.handleEvent}/>
              </ButtonGroup>
          </ButtonToolbar>
      );
  }
});

// this class for applying tag format to selection of text
var FormatButton = React.createClass({
  applyFormat: function(tag, editor){
    function _wrapText(tag, text){
      if (tag.match(/<[^>]*>/)){ // if this is a tag element
        var endTag = tag.replace(/</, "</");
      }
            else {
        var endTag = tag;
      }
      var wrappedText = tag + text + endTag;
      if (text.length > 0){
        var cursor = editor.getCursor();
        editor.replaceSelection(wrappedText);
        editor.setSelection({
          line: cursor.line,
          ch: tag.length
        }, {
            line: cursor.line,
            ch: tag.length + text.length
          });
      } else {
        editor.replaceSelection(wrappedText);
      }
      editor.focus();
    }
    var selection = editor.getSelection();
    if (selection.length == 0){
      selection = "Insert text here"; //TODO, customize different text for differernt format?
    }
    _wrapText(tag, selection);
  },
  handleClick: function(tag){
    var f = this.applyFormat.bind(this, tag);
    this.props.onEvent(f);
  },
  renderFontAwesome: function(cls){
    return (<i className={"fa "+cls}></i>);
  },
  render: function() {
    return (<Button onClick={this.handleClick.bind(this, this.props.tag)}>
            {this.renderFontAwesome(this.props.fa)}
        </Button>);
  }
});

module.exports = FormatPanel;
