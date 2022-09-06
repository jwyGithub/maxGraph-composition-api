import MaxToolbar from '../gui/MaxToolbar';
import Editor from './Editor';
import Cell from '../view/cell/Cell';
import ObjectCodec from '../serialization/ObjectCodec';
import Codec from '../serialization/Codec';
import type { DropHandler } from '../view/other/DragSource';
/**
 * Toolbar for the editor. This modifies the state of the graph
 * or inserts new cells upon mouse clicks.
 *
 * @Example:
 *
 * Create a toolbar with a button to copy the selection into the clipboard,
 * and a combo box with one action to paste the selection from the clipboard
 * into the graph.
 *
 * ```
 * var toolbar = new EditorToolbar(container, editor);
 * toolbar.addItem('Copy', null, 'copy');
 *
 * var combo = toolbar.addActionCombo('More actions...');
 * toolbar.addActionOption(combo, 'Paste', 'paste');
 * ```
 *
 * @Codec:
 *
 * This class uses the {@link DefaultToolbarCodec} to read configuration
 * data into an existing instance. See {@link DefaultToolbarCodec} for a
 * description of the configuration format.
 */
export declare class EditorToolbar {
    constructor(container?: HTMLElement | null, editor?: Editor | null);
    /**
     * Reference to the enclosing {@link Editor}.
     */
    editor: Editor | null;
    /**
     * Holds the internal {@link MaxToolbar}.
     */
    toolbar: MaxToolbar | null;
    /**
     * Reference to the function used to reset the {@link toolbar}.
     */
    resetHandler: Function | null;
    /**
     * Defines the spacing between existing and new vertices in gridSize units when a new vertex is dropped on an existing cell.  Default is 4 (40 pixels).
     *
     * @Default is 4
     */
    spacing: number;
    /**
     * Specifies if elements should be connected if new cells are dropped onto connectable elements.
     *
     * @Default is false.
     */
    connectOnDrop: boolean;
    /**
     * Constructs the {@link toolbar} for the given container and installs a listener that updates the {@link Editor.insertFunction} on {@link editor} if an item is selected in the toolbar.  This assumes that {@link editor} is not null.
     */
    init(container: HTMLElement): void;
    /**
     * Adds a new item that executes the given action in {@link editor}. The title,
     * icon and pressedIcon are used to display the toolbar item.
     *
     * @param title - String that represents the title (tooltip) for the item.
     * @param icon - URL of the icon to be used for displaying the item.
     * @param action - Name of the action to execute when the item is clicked.
     * @param pressed - Optional URL of the icon for the pressed state.
     */
    addItem(title: string, icon: string, action: string, pressed?: string): any;
    /**
     * Adds a vertical separator using the optional icon.
     *
     * @param icon - Optional URL of the icon that represents the vertical separator. Default is {@link Client.imageBasePath} + ‘/separator.gif’.
     */
    addSeparator(icon?: string): void;
    /**
     * Helper method to invoke {@link MaxToolbar.addCombo} on toolbar and return the resulting DOM node.
     */
    addCombo(): HTMLElement;
    /**
     * Helper method to invoke <MaxToolbar.addActionCombo> on <toolbar> using
     * the given title and return the resulting DOM node.
     *
     * @param title String that represents the title of the combo.
     */
    addActionCombo(title: string): HTMLSelectElement;
    /**
     * Binds the given action to a option with the specified label in the given combo.  Combo is an object returned from an earlier call to {@link addCombo} or {@link addActionCombo}.
     *
     * @param combo - DOM node that represents the combo box.
     * @param title - String that represents the title of the combo.
     * @param action - Name of the action to execute in {@link editor}.
     */
    addActionOption(combo: HTMLSelectElement, title: string, action: string): void;
    /**
     * Helper method to invoke {@link MaxToolbar.addOption} on {@link toolbar} and return the resulting DOM node that represents the option.
     *
     * @param combo - DOM node that represents the combo box.
     * @param title - String that represents the title of the combo.
     * @param value - Object that represents the value of the option.
     */
    addOption(combo: HTMLSelectElement, title: string, value: string | ((evt: any) => void) | null): HTMLElement;
    /**
     * Creates an item for selecting the given mode in the {@link editor}'s graph.
     * Supported modenames are select, connect and pan.
     *
     * @param title - String that represents the title of the item.
     * @param icon - URL of the icon that represents the item.
     * @param mode - String that represents the mode name to be used in {@link Editor.setMode}.
     * @param pressed - Optional URL of the icon that represents the pressed state.
     * @param funct - Optional JavaScript function that takes the {@link Editor} as the first and only argument that is executed after the mode has been selected.
     */
    addMode(title: string, icon: string, mode: string, pressed?: string | null, funct?: Function | null): any;
    /**
     * Creates an item for inserting a clone of the specified prototype cell into
     * the <editor>'s graph. The ptype may either be a cell or a function that
     * returns a cell.
     *
     * @param title String that represents the title of the item.
     * @param icon URL of the icon that represents the item.
     * @param ptype Function or object that represents the prototype cell. If ptype
     * is a function then it is invoked with no arguments to create new
     * instances.
     * @param pressed Optional URL of the icon that represents the pressed state.
     * @param insert Optional JavaScript function that handles an insert of the new
     * cell. This function takes the <Editor>, new cell to be inserted, mouse
     * event and optional <Cell> under the mouse pointer as arguments.
     * @param toggle Optional boolean that specifies if the item can be toggled.
     * Default is true.
     */
    addPrototype(title: string, icon: string, ptype: Function | Cell, pressed: string, insert: (editor: Editor, cell: Cell, me: MouseEvent, cellUnderMousePointer?: Cell | null) => void, toggle?: boolean): HTMLImageElement | HTMLButtonElement;
    /**
     * Handles a drop from a toolbar item to the graph. The given vertex
     * represents the new cell to be inserted. This invokes {@link insert} or
     * {@link connect} depending on the given target cell.
     *
     * @param vertex - {@link Cell} to be inserted.
     * @param evt - Mouse event that represents the drop.
     * @param target - Optional {@link Cell} that represents the drop target.
     */
    drop(vertex: Cell, evt: MouseEvent, target?: Cell | null): void;
    /**
     * Handles a drop by inserting the given vertex into the given parent cell
     * or the default parent if no parent is specified.
     *
     * @param vertex - {@link Cell} to be inserted.
     * @param evt - Mouse event that represents the drop.
     * @param target - Optional {@link Cell} that represents the parent.
     */
    insert(vertex: Cell, evt: MouseEvent, target?: Cell | null): any;
    /**
     * Handles a drop by connecting the given vertex to the given source cell.
     *
     * @param vertex - {@link Cell} to be inserted.
     * @param evt - Mouse event that represents the drop.
     * @param source - Optional {@link Cell} that represents the source terminal.
     */
    connect(vertex: Cell, evt: MouseEvent, source?: Cell | null): void;
    /**
     * Makes the given img draggable using the given function for handling a drop event.
     *
     * @param img - DOM node that represents the image.
     * @param dropHandler - Function that handles a drop of the image.
     */
    installDropHandler(img: HTMLElement, dropHandler: DropHandler): void;
    /**
     * Destroys the {@link toolbar} associated with this object and removes all installed listeners.
     * This does normally not need to be called, the {@link toolbar} is destroyed automatically when the window unloads (in IE) by {@link Editor}.
     */
    destroy(): void;
}
/**
 * Custom codec for configuring <EditorToolbar>s. This class is created
 * and registered dynamically at load time and used implicitly via
 * <Codec> and the <CodecRegistry>. This codec only reads configuration
 * data for existing toolbars handlers, it does not encode or create toolbars.
 */
export declare class EditorToolbarCodec extends ObjectCodec {
    constructor();
    /**
     * Returns null.
     */
    encode(enc: any, obj: any): null;
    /**
     * Reads a sequence of the following child nodes
     * and attributes:
     *
     * Child Nodes:
     *
     * add - Adds a new item to the toolbar. See below for attributes.
     * separator - Adds a vertical separator. No attributes.
     * hr - Adds a horizontal separator. No attributes.
     * br - Adds a linefeed. No attributes.
     *
     * Attributes:
     *
     * as - Resource key for the label.
     * action - Name of the action to execute in enclosing editor.
     * mode - Modename (see below).
     * template - Template name for cell insertion.
     * style - Optional style to override the template style.
     * icon - Icon (relative/absolute URL).
     * pressedIcon - Optional icon for pressed state (relative/absolute URL).
     * id - Optional ID to be used for the created DOM element.
     * toggle - Optional 0 or 1 to disable toggling of the element. Default is
     * 1 (true).
     *
     * The action, mode and template attributes are mutually exclusive. The
     * style can only be used with the template attribute. The add node may
     * contain another sequence of add nodes with as and action attributes
     * to create a combo box in the toolbar. If the icon is specified then
     * a list of the child node is expected to have its template attribute
     * set and the action is ignored instead.
     *
     * Nodes with a specified template may define a function to be used for
     * inserting the cloned template into the graph. Here is an example of such
     * a node:
     *
     * ```javascript
     * <add as="Swimlane" template="swimlane" icon="images/swimlane.gif"><![CDATA[
     *   function (editor, cell, evt, targetCell)
     *   {
     *     let pt = mxUtils.convertPoint(
     *       editor.graph.container, mxEvent.getClientX(evt),
     *         mxEvent.getClientY(evt));
     *     return editor.addVertex(targetCell, cell, pt.x, pt.y);
     *   }
     * ]]></add>
     * ```
     *
     * In the above function, editor is the enclosing <Editor> instance, cell
     * is the clone of the template, evt is the mouse event that represents the
     * drop and targetCell is the cell under the mousepointer where the drop
     * occurred. The targetCell is retrieved using {@link Graph#getCellAt}.
     *
     * Futhermore, nodes with the mode attribute may define a function to
     * be executed upon selection of the respective toolbar icon. In the
     * example below, the default edge style is set when this specific
     * connect-mode is activated:
     *
     * ```javascript
     * <add as="connect" mode="connect"><![CDATA[
     *   function (editor)
     *   {
     *     if (editor.defaultEdge != null)
     *     {
     *       editor.defaultEdge.style = 'straightEdge';
     *     }
     *   }
     * ]]></add>
     * ```
     *
     * Both functions require <DefaultToolbarCodec.allowEval> to be set to true.
     *
     * Modes:
     *
     * select - Left mouse button used for rubberband- & cell-selection.
     * connect - Allows connecting vertices by inserting new edges.
     * pan - Disables selection and switches to panning on the left button.
     *
     * Example:
     *
     * To add items to the toolbar:
     *
     * ```javascript
     * <EditorToolbar as="toolbar">
     *   <add as="save" action="save" icon="images/save.gif"/>
     *   <br/><hr/>
     *   <add as="select" mode="select" icon="images/select.gif"/>
     *   <add as="connect" mode="connect" icon="images/connect.gif"/>
     * </EditorToolbar>
     * ```
     */
    decode(dec: Codec, _node: Element, into: any): any;
}
export default EditorToolbar;