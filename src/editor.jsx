var React = require("react");
var ReactDOM = require("react-dom");
var Codemirror = require("react-codemirror");
require("codemirror/addon/search/searchcursor");
require("codemirror/mode/markdown/markdown");

var Previewer = require("./preview.jsx");

var FormatPanel = require("./format-panel.jsx");
var Grid = require("react-bootstrap/lib/Grid");
var Col = require("react-bootstrap/lib/Col");
var Row = require("react-bootstrap/lib/Row");

var Editor = React.createClass({
  getInitialState: function() {
    return {
      code: ""
    };
  },
  getCodeMirror: function(){
    return this.refs.editor.getCodeMirror();
  },
  handleChange: function(newCode) {
    this.setState({
      code: newCode
    });
  },
  handleFormat: function (fn) {
    var editor = this.codeMirror;
    fn(editor);
  },
  render: function() {
    var options = {
      mode: "markdown",
      lineNumbers: true,
      lineWrapping: true
    };
    return (
            <div id="editor">
                <Grid>
                    <Row>
                        <Col md={6} mdPush={6}>
                            <div>
                                <Previewer data={this.state.code}/>
                            </div>
                        </Col>
                        <Col md={6} mdPull={6}>
                            <FormatPanel onEvent={this.handleFormat} />
                            <Codemirror ref="editor" value={this.state.code} onChange={this.handleChange} options={options} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
  },
  componentDidMount: function() {
    this.codeMirror = this.getCodeMirror();
  }
});

ReactDOM.render(<Editor />, document.getElementById("code"));
