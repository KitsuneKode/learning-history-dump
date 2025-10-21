import Mustache from "mustache";
import { createLanguageService } from "typescript";

const template = "{{node.nodeId.data}}";

const data = {
  node: {
    nodeId: {
      data: "ndoe",
    },
  },
};

const rendererd = Mustache.render(template, data);

console.log(rendererd);
