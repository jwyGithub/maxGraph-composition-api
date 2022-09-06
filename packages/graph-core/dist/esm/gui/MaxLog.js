/*
Copyright 2021-present The maxGraph project Contributors
Copyright (c) 2006-2015, JGraph Ltd
Copyright (c) 2006-2015, Gaudenz Alder

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import Client from '../Client';
import InternalEvent from '../view/event/InternalEvent';
import { getInnerHtml, write } from '../util/domUtils';
import { toString } from '../util/StringUtils';
import MaxWindow, { popup } from './MaxWindow';
import { copyTextToClipboard } from '../util/Utils';
/**
 * A singleton class that implements a simple console.
 *
 * Variable: consoleName
 *
 * Specifies the name of the console window. Default is 'Console'.
 */
class MaxLog {
    /**
     * Initializes the DOM node for the console.
     * This requires document.body to point to a non-null value.
     * This is called from within setVisible if the log has not yet been initialized.
     */
    static init() {
        if (MaxLog.window == null && document.body != null) {
            const title = `${MaxLog.consoleName} - mxGraph ${Client.VERSION}`;
            // Creates a table that maintains the layout
            const table = document.createElement('table');
            table.setAttribute('width', '100%');
            table.setAttribute('height', '100%');
            const tbody = document.createElement('tbody');
            let tr = document.createElement('tr');
            const td = document.createElement('td');
            td.style.verticalAlign = 'top';
            // Adds the actual console as a textarea
            MaxLog.textarea = document.createElement('textarea');
            MaxLog.textarea.setAttribute('wrap', 'off');
            MaxLog.textarea.setAttribute('readOnly', 'true');
            MaxLog.textarea.style.height = '100%';
            MaxLog.textarea.style.resize = 'none';
            MaxLog.textarea.value = MaxLog.buffer;
            // Workaround for wrong width in standards mode
            if (Client.IS_NS && document.compatMode !== 'BackCompat') {
                MaxLog.textarea.style.width = '99%';
            }
            else {
                MaxLog.textarea.style.width = '100%';
            }
            td.appendChild(MaxLog.textarea);
            tr.appendChild(td);
            tbody.appendChild(tr);
            // Creates the container div
            tr = document.createElement('tr');
            MaxLog.td = document.createElement('td');
            MaxLog.td.style.verticalAlign = 'top';
            MaxLog.td.setAttribute('height', '30px');
            tr.appendChild(MaxLog.td);
            tbody.appendChild(tr);
            table.appendChild(tbody);
            // Adds various debugging buttons
            MaxLog.addButton('Info', function (evt) {
                MaxLog.info();
            });
            MaxLog.addButton('DOM', function (evt) {
                const content = getInnerHtml(document.body);
                MaxLog.debug(content);
            });
            MaxLog.addButton('Trace', function (evt) {
                MaxLog.TRACE = !MaxLog.TRACE;
                if (MaxLog.TRACE) {
                    MaxLog.debug('Tracing enabled');
                }
                else {
                    MaxLog.debug('Tracing disabled');
                }
            });
            MaxLog.addButton('Copy', function (evt) {
                try {
                    copyTextToClipboard(MaxLog.textarea.value);
                }
                catch (err) {
                    alert(err);
                }
            });
            MaxLog.addButton('Show', function (evt) {
                try {
                    popup(MaxLog.textarea.value);
                }
                catch (err) {
                    alert(err);
                }
            });
            MaxLog.addButton('Clear', function (evt) {
                MaxLog.textarea.value = '';
            });
            // Cross-browser code to get window size
            let h = 0;
            let w = 0;
            if (typeof window.innerWidth === 'number') {
                h = window.innerHeight;
                w = window.innerWidth;
            }
            else {
                h = document.documentElement.clientHeight || document.body.clientHeight;
                w = document.body.clientWidth;
            }
            MaxLog.window = new MaxWindow(title, table, Math.max(0, w - 320), Math.max(0, h - 210), 300, 160);
            MaxLog.window.setMaximizable(true);
            MaxLog.window.setScrollable(false);
            MaxLog.window.setResizable(true);
            MaxLog.window.setClosable(true);
            MaxLog.window.destroyOnClose = false;
            // Workaround for ignored textarea height in various setups
            if (Client.IS_NS &&
                !Client.IS_GC &&
                !Client.IS_SF &&
                document.compatMode !== 'BackCompat') {
                const elt = MaxLog.window.getElement();
                const resizeHandler = (sender, evt) => {
                    MaxLog.textarea.style.height = `${Math.max(0, elt.offsetHeight - 70)}px`;
                };
                MaxLog.window.addListener(InternalEvent.RESIZE_END, resizeHandler);
                MaxLog.window.addListener(InternalEvent.MAXIMIZE, resizeHandler);
                MaxLog.window.addListener(InternalEvent.NORMALIZE, resizeHandler);
                MaxLog.textarea.style.height = '92px';
            }
        }
    }
    /**
     * Writes the current navigator information to the console.
     */
    static info() {
        MaxLog.writeln(toString(navigator));
    }
    /**
     * Adds a button to the console using the given label and function.
     */
    static addButton(lab, funct) {
        const button = document.createElement('button');
        write(button, lab);
        InternalEvent.addListener(button, 'click', funct);
        MaxLog.td.appendChild(button);
    }
    /**
     * Returns true if the console is visible.
     */
    // static isVisible(): boolean;
    static isVisible() {
        if (MaxLog.window != null) {
            return MaxLog.window.isVisible();
        }
        return false;
    }
    /**
     * Shows the console.
     */
    // static show(): void;
    static show() {
        MaxLog.setVisible(true);
    }
    /**
     * Shows or hides the console.
     */
    static setVisible(visible) {
        if (MaxLog.window == null) {
            MaxLog.init();
        }
        if (MaxLog.window != null) {
            MaxLog.window.setVisible(visible);
        }
    }
    /**
     * Writes the specified string to the console if TRACE is true and returns the current time in milliseconds.
     */
    static enter(string) {
        if (MaxLog.TRACE) {
            MaxLog.writeln(`Entering ${string}`);
            return new Date().getTime();
        }
    }
    /**
     * Writes the specified string to the console
     * if <TRACE> is true and computes the difference
     * between the current time and t0 in milliseconds.
     * See <enter> for an example.
     */
    static leave(string, t0) {
        if (MaxLog.TRACE) {
            const dt = t0 !== 0 ? ` (${new Date().getTime() - t0} ms)` : '';
            MaxLog.writeln(`Leaving ${string}${dt}`);
        }
    }
    /**
     * Adds all arguments to the console if DEBUG is enabled.
     */
    // static debug(message: string): void;
    static debug(...args) {
        if (MaxLog.DEBUG) {
            MaxLog.writeln(...args);
        }
    }
    /**
     * Adds all arguments to the console if WARN is enabled.
     */
    // static warn(message: string): void;
    static warn(...args) {
        if (MaxLog.WARN) {
            MaxLog.writeln(...args);
        }
    }
    /**
     * Adds the specified strings to the console.
     */
    static write(...args) {
        let string = '';
        for (let i = 0; i < args.length; i += 1) {
            string += args[i];
            if (i < args.length - 1) {
                string += ' ';
            }
        }
        if (MaxLog.textarea != null) {
            MaxLog.textarea.value = MaxLog.textarea.value + string;
            // Workaround for no update in Presto 2.5.22 (Opera 10.5)
            if (navigator.userAgent != null && navigator.userAgent.indexOf('Presto/2.5') >= 0) {
                MaxLog.textarea.style.visibility = 'hidden';
                MaxLog.textarea.style.visibility = 'visible';
            }
            MaxLog.textarea.scrollTop = MaxLog.textarea.scrollHeight;
        }
        else {
            MaxLog.buffer += string;
        }
    }
    /**
     * Adds the specified strings to the console, appending a linefeed at the end of each string.
     */
    static writeln(...args) {
        let string = '';
        for (let i = 0; i < args.length; i += 1) {
            string += args[i];
            if (i < args.length - 1) {
                string += ' ';
            }
        }
        MaxLog.write(`${string}\n`);
    }
}
MaxLog.textarea = null;
MaxLog.consoleName = 'Console';
/**
 * Specified if the output for <enter> and <leave> should be visible in the
 * console. Default is false.
 */
MaxLog.TRACE = false;
/**
 * Specifies if the output for <debug> should be visible in the console.
 * Default is true.
 */
MaxLog.DEBUG = true;
/**
 * Specifies if the output for <warn> should be visible in the console.
 * Default is true.
 */
MaxLog.WARN = true;
/**
 * Buffer for pre-initialized content.
 */
MaxLog.buffer = '';
export default MaxLog;