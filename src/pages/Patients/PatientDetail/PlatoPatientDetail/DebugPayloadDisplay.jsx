import React, { useState } from "react";
import { Button, Card, CardBody, CardTitle } from "reactstrap";
import PropTypes from "prop-types";

const DebugPayloadDisplay = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const syntaxHighlight = (json) => {
    if (typeof json !== "string") {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      function (match) {
        var cls = "text-primary"; // Default number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "text-danger"; // Key
          } else {
            cls = "text-success"; // String
          }
        } else if (/true|false/.test(match)) {
          cls = "text-warning"; // Boolean
        } else if (/null/.test(match)) {
          cls = "text-muted"; // Null
        }
        return '<span class="' + cls + '">' + match + "</span>";
      },
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mt-3 border">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <CardTitle className="h5 mb-0">Debug Payload</CardTitle>
          <Button
            color={copied ? "success" : "secondary"}
            size="sm"
            onClick={handleCopy}
            outline
          >
            <i
              className={`mdi ${copied ? "mdi-check" : "mdi-content-copy"} me-1`}
            ></i>
            {copied ? "Copied" : "Copy JSON"}
          </Button>
        </div>
        <div
          className="bg-light p-3 rounded"
          style={{
            maxHeight: "80vh",
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "12px",
          }}
        >
          <pre
            className="mb-0"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(data) }}
          />
        </div>
      </CardBody>
    </Card>
  );
};

DebugPayloadDisplay.propTypes = {
  data: PropTypes.object.isRequired,
};

export default DebugPayloadDisplay;
