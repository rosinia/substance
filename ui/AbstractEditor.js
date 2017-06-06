import Component from './Component'
import ResourceManager from './ResourceManager'
import DOMSelection from './DOMSelection'
import { DefaultDOMElement } from '../dom'

/**
  Reusable abstract editor implementation.

  @example

  ```js
  class SimpleWriter extends AbstractEditor {
    render($$) {
      // render editor
    }
  }
  ```
*/
class AbstractEditor extends Component {

  constructor(...args) {
    super(...args)
    this._initialize(this.props)
  }

  _initialize(props) {
    if (!props.editorSession) {
      throw new Error('EditorSession instance required');
    }
    this.editorSession = props.editorSession
    this.doc = this.editorSession.getDocument()

    let configurator = this.editorSession.getConfigurator()
    this.componentRegistry = configurator.getComponentRegistry()
    this.commandGroups = configurator.getcommandGroups()
    this.keyboardShortcuts = configurator.getKeyboardShortcutsByCommand()
    this.tools = configurator.getTools()
    this.labelProvider = configurator.getLabelProvider()
    this.iconProvider = configurator.getIconProvider()

    // legacy
    this.surfaceManager = this.editorSession.surfaceManager
    this.commandManager = this.editorSession.commandManager
    this.dragManager = this.editorSession.dragManager
    this.macroManager = this.editorSession.macroManager
    this.converterRegistry = this.editorSession.converterRegistry
    this.globalEventHandler = this.editorSession.globalEventHandler
    this.editingBehavior = this.editorSession.editingBehavior
    this.markersManager = this.editorSession.markersManager

    this.resourceManager = new ResourceManager(this.editorSession, this.getChildContext())

    this.domSelection = new DOMSelection(this)

    this.documentEl = DefaultDOMElement.wrapNativeElement(document)
    this.documentEl.on('keydown', this.onKeyDown, this)
  }

  willReceiveProps(nextProps) {
    let newSession = nextProps.editorSession
    let shouldDispose = newSession && newSession !== this.editorSession
    if (shouldDispose) {
      this._dispose()
      this._initialize(nextProps)
    }
  }

  dispose() {
    this._dispose()
  }

  _dispose() {
    // Note: we need to clear everything, as the childContext
    // changes which is immutable
    this.empty()
    // not necessary
    // this.domSelection.dispose()
    this.resourceManager.dispose()
  }

  getChildContext() {
    return {
      editor: this,
      editorSession: this.editorSession,
      doc: this.doc, // TODO: remove in favor of editorSession
      componentRegistry: this.componentRegistry,
      surfaceManager: this.surfaceManager,
      domSelection: this.domSelection,
      commandManager: this.commandManager,
      markersManager: this.markersManager,
      converterRegistry: this.converterRegistry,
      dragManager: this.dragManager,
      editingBehavior: this.editingBehavior,
      globalEventHandler: this.globalEventHandler,
      iconProvider: this.iconProvider,
      labelProvider: this.labelProvider,
      resourceManager: this.resourceManager,
      commandGroups: this.commandGroups,
      tools: this.tools,
      keyboardShortcuts: this.keyboardShortcuts
    }
  }

  /*
    Handle document key down events.
  */
  onKeyDown(event) {
    // ignore fake IME events (emitted in IE and Chromium)
    if ( event.key === 'Dead' ) return
    // keyboard shortcuts
    let custom = this.editorSession.keyboardManager.onKeydown(event)
  }

  getDocument() {
    return this.editorSession.getDocument()
  }

  getConfigurator() {
    return this.editorSession.getConfigurator()
  }

  getEditorSession() {
    return this.editorSession
  }

  getComponentRegistry() {
    return this.componentRegistry
  }
}

export default AbstractEditor
