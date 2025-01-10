// Save to package.json
// ============================================================================

import { Builder, generateIgnoredKeybinds } from "../../meta";
import * as fs from "fs/promises";
import { extensionId } from "../../src/utils/constants";

const version = "0.1.0",
      preRelease = 1,
      preReleaseVersion = `${version}-pre${preRelease}`;

function run(...commands: (string | [string, {[arg: string]: any}])[]) {
  return {
    "command": "dance.run",
    "args": [{ commands }],
  };
}
export const pkg = (modules: Builder.ParsedModule[]) => ({

  // Common package.json properties.
  // ==========================================================================

  name: "dance-helix-keybindings",
  description: "Helix keybindings for Dance",
  version,
  license: "ISC",
  extensionDependencies: [extensionId],
  author: {
    name: "Grégoire Geis",
    email: "opensource@gregoirege.is",
  },

  contributors: [
    {
      name: "Rémi Lavergne",
      url: "https://github.com/Strackeror",
    },
  ],

  repository: {
    type: "git",
    url: "https://github.com/71/dance.git",
  },

  engines: {
    vscode: "^1.63.0",
  },

  displayName: "Dance (Helix keybindings)",
  publisher: "gregoire",
  categories: ["Keymaps", "Other"],
  readme: "README.md",
  icon: "dance.png",
  extensionKind: ["ui", "workspace"],

  scripts: {
    "package": "vsce package --allow-star-activation",
    "publish": "vsce publish --allow-star-activation",
    "package:pre": `vsce package --allow-star-activation --pre-release --no-git-tag-version --no-update-package-json ${preReleaseVersion}`,
    "publish:pre": `vsce publish --allow-star-activation --pre-release --no-git-tag-version --no-update-package-json ${preReleaseVersion}`,
  },

  contributes: {
    configurationDefaults: {
      "dance.defaultMode": "helix/normal",
      "dance.modes": {
        "": {
          hiddenSelectionsIndicatorsDecoration: {
            after: {
              color: "$list.warningForeground",
            },
            backgroundColor: "$inputValidation.warningBackground",
            borderColor: "$inputValidation.warningBorder",
            borderStyle: "solid",
            borderWidth: "1px",
            isWholeLine: true,
          },
        },
        "input": {
          cursorStyle: "underline-thin",
        },
        "helix/insert": {
          onLeaveMode: [
            [".selections.save", {
              register: " insert",
            }],
          ],
        },
        "helix/select": {
          cursorStyle: "block",
          selectionBehavior: "character",
        },
        "helix/normal": {
          cursorStyle: "block",
          selectionBehavior: "character",
          decorations: {
            applyTo: "main",
            backgroundColor: "$editor.hoverHighlightBackground",
            isWholeLine: true,
          },
          onEnterMode: [
            [".selections.restore", { register: " ^", try: true }],
          ],
          onLeaveMode: [
            [".selections.save", {
              register: " ^",
              style: {
                borderColor: "$editor.selectionBackground",
                borderStyle: "solid",
                borderWidth: "2px",
                borderRadius: "1px",
              },
              until: [
                ["mode-did-change", { include: "normal" }],
                ["selections-did-change"],
              ],
            }],
          ],
        },
      },

    "dance.menus": {
        match: {
          title: "Match",
          items: {
            // Should be jump in normal mode, extend in select mode, but jump for seek.enclosing is not implemented
            "m": { command: "dance.seek.enclosingSurround", text: "Goto matching bracket" },
            "a": { command: "dance.openMenu", args: [{ menu: "object", title: "Match around" }], text: "Select around object" },
            "i": { command: "dance.openMenu", args: [{ menu: "object", title: "Match inside", pass: [{ inner: true }] }], text: "Select inside object" },
            "s": { command: "dance.edit.surround", text: "Surround add" },
            "d": { command: "dance.edit.surroundReplace", text: "Surround delete", args: [{ replacePair: ["", ""] }] },
            "r": { command: "dance.edit.surroundReplace", text: "Surround replace" },
          },
        },
        object: {
          title: "Select object...",
          items: ((command = "dance.seek.object") => ({
            "w": { command, args: [{ input: "[\\p{L}_\\d]+(?<after>[^\\S\\n]+)" }], text: "Word" },
            "W": { command, args: [{ input: "[\\S]+(?<after>[^\\S\\n]+)" }], text: "WORD" },
            "p": { command, args: [{ input: "(?#predefined=paragraph)" }], text: "Paragraph" },
            "t": { command, args: [{ input: "(?#textobject=class)" }], text: "Type definition (tree-sitter)" },
            "f": { command, args: [{ input: "(?#textobject=function)" }], text: "Function (tree-sitter)" },
            "a": { command, args: [{ input: "(?#textobject=parameter)" }], text: "Argument/parameter (tree-sitter)" },
            "c" : { command, args: [{ input: "(?#textobject=comment)" }], text: "Comment (tree-sitter)" },
            "T" : { command, args: [{ input: "(?#textobject=test)" }], text: "Test (tree-sitter)" },
            "e" : { command, args: [{ input: "(?#textobject=entry)" }], text: "Data structure entry (tree-sitter)" },
            "!": { command, text: "custom object desc" },
            "()": { command, args: [{ input: "\\((?#inner)\\)" }], text: "$HIDDEN" },
            "{}": { command, args: [{ input: "\\{(?#inner)\\}" }], text: "$HIDDEN" },
            "[]": { command, args: [{ input: "\\[(?#inner)\\]" }], text: "$HIDDEN" },
            "<>": { command, args: [{ input: "<(?#inner)>" }], text: "$HIDDEN" },
            '"': { command, args: [{ input: "(?#noescape)\"(?#inner)(?#noescape)\"" }], text: "$HIDDEN" },
            "'": { command, args: [{ input: "(?#noescape)'(?#inner)(?#noescape)'" }], text: "$HIDDEN" },
            "`": { command, args: [{ input: "(?#noescape)`(?#inner)(?#noescape)`" }], text: "$HIDDEN" },
            " ": { command: "dance.ignore", text:  "... Or any paired character" },
          }))(),
        },

        view: {
          "title": "View",
          "items": {
            "cz": { text: "Align view center", command: "dance.view.line", args: [{ "at": "center" }] },
            "t": { text: "Align view top", command: "dance.view.line", args: [{ "at": "top" }] },
            "b": { text: "Align view bottom", command: "dance.view.line", args: [{ "at": "bottom" }] },
            "k": { text: "Scroll view up", command: "editorScroll", args: [{ "by": "line", "revealCursor": true, "to": "up" }] },
            "j": { text: "Scroll view down", command: "editorScroll", args: [{ "by": "line", "revealCursor": true, "to": "down" }] },
            "/": { text: "Search for regex pattern", command: "dance.search" },
            "?": { text: "Reverse search for regex pattern", command: "dance.search.backward" },
            "n": { text: "Select next search match", command: "dance.search.next" },
            "N": { text: "Select previous search match", command: "dance.search.previous" },
          },
        },

        goto: {
          title: "Goto",
          items: {
            "g": { text: "to line number else file start", command: "dance.select.nthLine" },
            "e": { text: "to last line", command: "dance.select.lineEnd", args: [{ count: 2 ** 31 - 1 }] },
            "f": { text: "to file/URLs in selections", command: "dance.selections.open" },
            "h": { text: "to line start", command: "dance.select.lineStart", args: [{ count: 0 }] },
            "l": { text: "to line end", command: "dance.select.lineEnd", args: [{ count: 0 }] },
            "s": { text: "to first non-blank in line", command: "dance.select.lineStart", args: [{ skipBlank: true, count: 0 }] },
            "d": { text: "to definition", command: "editor.action.revealDefinition" },
            "D": { text: "to declaration", command: "editor.action.goToDeclaration" },
            "y": { text: "to type definition", command: "editor.action.goToTypeDefinition" },
            "r": { text: "to references", command: "editor.action.goToReferences" },
            "i": { text: "to implementation", command: "editor.action.goToImplementation" },
            "t": { text: "to window top", command: "dance.select.firstVisibleLine" },
            "c": { text: "to window center", command: "dance.select.middleVisibleLine" },
            "b": { text: "to window bottom", command: "dance.select.lastVisibleLine" },
            "a": { text: "to last buffer", command: "workbench.action.openPreviousRecentlyUsedEditorInGroup" },
            "n": { text: "to next buffer", command: "workbench.action.nextEditor" },
            "p": { text: "to previous buffer", command: "workbench.action.previousEditor" },
            ".": { text: "to last buffer modification position", command: "dance.selections.restore", args: [{ register: " insert" }] },
            "w": { text: "to two-letter label", command: "dance.seek.jumpLabel" },
          },
        },

        space: {
          title: "Space",
          items: {
            "f": { text: "Open file picker", command: "workbench.action.quickOpen" },
            "b": { text: "Open buffer picker", command: "workbench.action.showEditorsInGroup" },
            "s": { text: "Open symbol picker", command: "workbench.action.gotoSymbol" },
            "S": { text: "Open symbol picker", command: "workbench.action.showAllSymbols" },
            "d": { text: "Open diagnostic picker", command: "workbench.actions.view.problems" },
            "a": { text: "Perform code action", command: "editor.action.quickFix" },
            // "g": { text: "Debug", command: "dance.openMenu", args: [{ "menu": "debug-hx", "locked": true }] },
            "w": { text: "Window", command: "dance.openMenu", args: [{ "menu": "window" }] },
            "y": { text: "Join and yank selections to clipboard", ...run(
              ["dance.selections.saveText", { "register": "dquote" }],
              ".modes.set.normal",
            ) },
            "Y": { text: "Yank main selection to clipboard", ...run(
              ["dance.selections.saveText", { "register": "dquote" }],
              ".modes.set.normal",
            ) },
            "p": { text: "Paste clipboard after selections", command: "dance.edit.insert", args: [{ "handleNewLine": true, "where": "end" }] },
            "P": { text: "Paste clipboard before selections", command: "dance.edit.insert", args: [{ "handleNewLine": true, "where": "start" }] },
            "R": { text: "Replace selections by clipboard content", command: "dance.edit.insert", args: [{ "register": "dquote" }] },
            "/": { text: "Global search in workspace folder", command: "workbench.action.findInFiles" },
            "k": { text: "Show docs for item under cursor", command: "editor.action.showHover" },
            "r": { text: "Rename symbol", command: "editor.action.rename" },
            "c": { text: "Comment/uncomment selections", command: "editor.action.commentLine" },
            "C": { text: "Block comment/uncomment selections", command: "editor.action.blockComment" },
            "?": { text: "Open command palette", command: "workbench.action.showCommands" },
          },
        },
        right_bracket: {
          title: "Right bracket",
          items: {
            "d": { text: "Goto next diagnostic", command: "editor.action.marker.next" },
            "g": { text: "Goto next change", command: "workbench.action.editor.nextChange" },
            "f": { text: "Goto next function", command: "dance.seek.goto.syntax.object", args: [{ direction: 1, object: "function.around" }] },
            "t": { text: "Goto next class", command: "dance.seek.goto.syntax.object", args: [{ direction: 1, object: "class.around" }] },
            "a": { text: "Goto next parameter", command: "dance.seek.goto.syntax.object", args: [{ direction: 1, object: "parameter.around" }] },
            "c": { text: "Goto next comment", command: "dance.seek.goto.syntax.object", args: [{ direction: 1, object: "comment.around" }] },
            "e": { text: "Goto next entry", command: "dance.seek.goto.syntax.object", args: [{ direction: 1, object: "entry.around" }] },
            "T": { text: "Goto next test", command: "dance.seek.goto.syntax.object", args: [{ direction: 1, object: "test.around" }] },
          },
        },
        left_bracket: {
          title: "Left bracket",
          items: {
            "d": { text: "Goto previous diagnostic", command: "editor.action.marker.prev" },
            "g": { text: "Goto previous change", command: "workbench.action.editor.previousChange" },
            "f": { text: "Goto previous function", command: "dance.seek.goto.syntax.object", args: [{ direction: -1, object: "function.around" }] },
            "t": { text: "Goto previous class", command: "dance.seek.goto.syntax.object", args: [{ direction: -1, object: "class.around" }] },
            "a": { text: "Goto previous parameter", command: "dance.seek.goto.syntax.object", args: [{ direction: -1, object: "parameter.around" }] },
            "c": { text: "Goto previous comment", command: "dance.seek.goto.syntax.object", args: [{ direction: -1, object: "comment.around" }] },
            "e": { text: "Goto previous entry", command: "dance.seek.goto.syntax.object", args: [{ direction: -1, object: "entry.around" }] },
            "T": { text: "Goto previous test", command: "dance.seek.goto.syntax.object", args: [{ direction: -1, object: "test.around" }] },
          },
        },
        window: {
          "title": "View",
          "items": {
            w: { text: "Goto next window", command: "workbench.action.focusNextGroup" },
            s: { text: "Horizontal bottom split", command: "workbench.action.splitEditorDown" },
            v: { text: "Vertical right split", command: "workbench.action.splitEditor" },
            t: { text: "Transpose splits", ...run("workbench.action.toggleEditorGroupLayout", "workbench.action.focusActiveEditorGroup") },
            q: { text: "Close window", command: "workbench.action.closeEditorsAndGroup" },
            o: { text: "Close windows except current", command: "workbench.action.closeEditorsInOtherGroups" },
            h: { text: "Jump to the left split", command: "workbench.action.focusLeftGroup" },
            j: { text: "Jump to the split below", command: "workbench.action.focusBelowGroup" },
            k: { text: "Jump to the split above", command: "workbench.action.focusAboveGroup" },
            l: { text: "Jump to the right split", command: "workbench.action.focusRightGroup" },
            H: { text: "Swap with the left split", command: "workbench.action.moveActiveEditorGroupLeft" },
            J: { text: "Swap with the split below", command: "workbench.action.moveActiveEditorGroupDown" },
            K: { text: "Swap with the split above", command: "workbench.action.moveActiveEditorGroupUp" },
            L: { text: "Swap with the right split", command: "workbench.action.moveActiveEditorGroupRight" },
            n: { text: "New split scratch buffer", command: "dance.openMenu", args: [{ menu: "new-window" }] },
          },
        },
        "new-window": {
          "title": "New split scratch buffer",
          "items": {
            "s": { "text": "Horizontal bottom split scratch buffer", ...run(
              "workbench.action.splitEditorDown",
              "workbench.action.files.newUntitledFile",
              "workbench.action.closeOtherEditors",
            ) },
            "v": { "text": "Vertical right split scratch buffer", ...run(
              "workbench.action.splitEditor",
              "workbench.action.files.newUntitledFile",
              "workbench.action.closeOtherEditors",
            ) },
          },
        },
        command: {
          title: "Command",
          palette: true,
          items: {
            "w": { text: "Write", command: "workbench.action.files.save" },
            "bc": { text: "Close buffer", command: "workbench.action.closeActiveEditor" },
            "bco": { text: "Close other buffers", command: "workbench.action.closeOtherEditors" },
            "fmt": { text: "Format file", command: "editor.action.formatDocument" },
          },
        },
      },
    },

    keybindings: (() => {
      const ignoredKeybindings = [],
            keybindings = modules
              .flatMap((module) => module.keybindings)
              .filter((keybinding) => ["core", "helix", undefined].includes(keybinding.category))
              .map(({ category, ...kb }) => kb);

      for (const mode of ["normal", "select", "insert"]) {
        for (const keybind of keybindings) {
          keybind.when = keybind.when.replace(`dance.mode == '${mode}'`, `dance.mode == 'helix/${mode}'`);
        }
      }

      for (const mode of ["normal", "select"]) {
        const whenMode = `editorTextFocus && dance.mode == 'helix/${mode}'`;
        ignoredKeybindings.push(...generateIgnoredKeybinds(
          keybindings.filter(key => key.when.includes(whenMode)),
          whenMode,
        ));

      }

      return [
        ...keybindings,
        ...ignoredKeybindings,
      ];
    })(),


  },
});


export async function build(builder: Builder) {
  await fs.writeFile(
    `${__dirname}/package.json`,
    JSON.stringify(pkg(await builder.getCommandModules()), undefined, 2) + "\n",
    "utf-8",
  );
}
