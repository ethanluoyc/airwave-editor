var React = require("react");
var Panel = require("react-bootstrap/lib/Panel");
var $ = require("jquery");
var converter = new Markdown.Converter();
Markdown.Extra.init(converter, {extensions: "all"});

var Previewer = React.createClass({
  mdConvert: function() {
    var rawMarkup = converter.makeHtml(this.props.data.toString());
    return { __html: rawMarkup };
  },
  render: function(){
    return (<Panel>
                    <div id="preview-panel">
                        <span dangerouslySetInnerHTML = {this.mdConvert()} />
                    </div>
                </Panel>);
  }
});

var PreviewToggleButton = React.createClass({
  handleToggle: function() {
    var preview = this.refs.preview;
    var state = $(preview).attr("preview");
    if (state=="true") {
      $("#preview-panel").fadeOut(400,
                    function(){
                      $("#code-panel").css("width","100%");
                    }
            );
      $(preview).text("Show Preview");
      $(preview).attr("preview", "false");
    } else {
      $("#preview-panel").fadeIn(400,
                    function(){
                      $("#code-panel").css("width","50%");
                    }
            );
      $(preview).text("Hide Preview");
      $(preview).attr("preview", "true");
    }
    return false;
  },
  render: function() {
    return (<Button ref="preview" onClick={this.handleToggle}>Show Preview</Button>);
  }
});

module.exports = Previewer;
