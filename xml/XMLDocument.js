import {
  IncrementalData, Document,
  PropertyIndex, AnnotationIndex,
  DocumentNodeFactory
} from '../model'
import { uuid } from '../util'
import { DefaultDOMElement } from '../dom'

import ParentNodeHook from './ParentNodeHook'
import XMLEditingInterface from './XMLEditingInterface'

export default
class XMLDocument extends Document {

  _initialize() {
    this.nodeFactory = new DocumentNodeFactory(this)
    this.data = new IncrementalData(this.schema, this.nodeFactory)
    // all by type
    this.addIndex('type', new PropertyIndex('type'))
    // special index for (property-scoped) annotations
    this.addIndex('annotations', new AnnotationIndex())
    ParentNodeHook.register(this)
  }

  toXML() {
    let dom = DefaultDOMElement.createDocument('xml')
    dom.setDocType(...this.getDocTypeParams())
    let rootElement = this.getRootNode().toXML()
    dom.append(rootElement)
    return dom
  }

  getDocTypeParams() {
    // return [qualifiedNameStr, publicId, systemId]
    throw new Error('This method is abstract')
  }

  getXMLSchema() {
    // should provide an XMLSchema instance
    throw new Error('This method is abstract')
  }

  getRootNode() {
    // should provide the root-element
    throw new Error('This method is abstract')
  }

  /*
    Provide a <!DOCTYPE ...> element as a string here
  */
  getDocTypeAsString() {
    return new Error('This method is abstract')
  }

  createEditingInterface() {
    return new XMLEditingInterface(this)
  }

  find(cssSelector) {
    return this.getRootNode().find(cssSelector)
  }

  findAll(cssSelector) {
    return this.getRootNode().findAll(cssSelector)
  }

  createElement(tagName) {
    let node = this.create({
      id: uuid(tagName),
      type: tagName
    })
    return node
  }

  getElementSchema(type) {
    return this.getXMLSchema().getElementSchema(type)
  }

}
