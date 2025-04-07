import * as vscode from "vscode";

import type { Argument } from ".";
import { firstVisibleLine as apiFirstVisibleLine, lastVisibleLine as apiLastVisibleLine, middleVisibleLine as apiMiddleVisibleLine, Context, Direction, Lines, Positions, SelectionBehavior, Selections, Shift, showMenuByName } from "../api";
import { PerEditorState } from "../state/editors";
import { unsafeSelections } from "../utils/misc";

/**
 * Update selections based on their position in the document.
 *
 * #### Keybinds
 *
 * | Keybinding          | Command                                                        |
 * | ------------------- | -------------------------------------------------------------- |
 * | `g` (helix: normal) | `[".openMenu", { menu: "goto", pass: [{ shift: "jump"   }] }]` |
 * | `g` (helix: select) | `[".openMenu", { menu: "goto", pass: [{ shift: "extend" }] }]` |
 */
declare module "./select";

/**
 * Select whole buffer.
 *
 * @keys `%` (core: normal; helix: select)
 */
export function buffer(_: Context) {
  Selections.set([Selections.wholeBuffer()]);
}

interface PreferredColumnsState {
  disposable: vscode.Disposable;
  expectedSelections: readonly vscode.Selection[];
  preferredColumns: number[];
}

const preferredColumnsToken =
  PerEditorState.registerState<PreferredColumnsState>(/* isDisposable= */ false);

export async function verticallyNative(
  _: Context,
  repetitions: number,
  direction = Direction.Forward,
  shift = Shift.Jump,
) {

  if (shift === Shift.Select) {
    await vscode.commands.executeCommand("cursorMove", {
      direction: "left", value: 0, select: false,
    });
  }

  await vscode.commands.executeCommand("cursorMove", {
    to: direction === Direction.Forward ? "down" : "up",
    by: "wrappedLine",
    value: repetitions,
    select: shift !== Shift.Jump,
  });
}

/**
 * Select vertically.
 *
 * @param avoidEol If `true`, selections will not select the line break
 *   character but will instead move to the last character.
 *
 * #### Variants
 *
 * | Title       | Identifier    | Keybinding                                                                                        | Command                                                           |
 * | ----------- | ------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
 * | Jump down   | `down.jump`   | `j` (core: normal)  , `down` (core: normal)                                                       | `[".select.vertically", { direction:  1, shift: "jump"  , ... }]` |
 * | Extend down | `down.extend` | `s-j` (kakoune: normal), `s-down` (kakoune: normal), `j` (helix: select), `down` (helix: select)  | `[".select.vertically", { direction:  1, shift: "extend", ... }]` |
 * | Jump up     | `up.jump`     | `k` (core: normal)  , `up` (core: normal)                                                         | `[".select.vertically", { direction: -1, shift: "jump"  , ... }]` |
 * | Extend up   | `up.extend`   | `s-k` (kakoune: normal), `s-up` (kakoune: normal)  , `k` (helix: select), `up` (helix: select)    | `[".select.vertically", { direction: -1, shift: "extend", ... }]` |
 *
 * The following keybindings are also defined:
 *
 * | Keybinding                         | Command                                                                      |
 * | -----------------------------------| ---------------------------------------------------------------------------- |
 * | `c-f` (core: normal; core: insert) | `[".select.vertically", { direction:  1, by: "page"    , shift: "jump" }]`   |
 * | `c-d` (core: normal; core: insert) | `[".select.vertically", { direction:  1, by: "halfPage", shift: "jump" }]`   |
 * | `c-b` (core: normal; core: insert) | `[".select.vertically", { direction: -1, by: "page"    , shift: "jump" }]`   |
 * | `c-u` (core: normal; core: insert) | `[".select.vertically", { direction: -1, by: "halfPage", shift: "jump" }]`   |
 * | `c-f` (helix: select)              | `[".select.vertically", { direction:  1, by: "page"    , shift: "extend" }]` |
 * | `c-d` (helix: select)              | `[".select.vertically", { direction:  1, by: "halfPage", shift: "extend" }]` |
 * | `c-b` (helix: select)              | `[".select.vertically", { direction: -1, by: "page"    , shift: "extend" }]` |
 * | `c-u` (helix: select)              | `[".select.vertically", { direction: -1, by: "halfPage", shift: "extend" }]` |
 */
export function vertically(
  _: Context,
  selections: readonly vscode.Selection[],

  avoidEol: Argument<boolean> = false,
  repetitions: number,
  direction = Direction.Forward,
  shift = Shift.Select,
  by?: Argument<"page" | "halfPage">,
) {
  // Adjust repetitions if a `by` parameter is given.
  if (by !== undefined) {
    const visibleRangeSize = _.editor.visibleRanges.reduce(
      (acc, elem) => acc + elem.end.line - elem.start.line, 0,
    );
    if (by === "page") {
      repetitions *= visibleRangeSize;
    } else if (by === "halfPage") {
      repetitions *= Math.floor(visibleRangeSize / 2);
    }
  }
  return verticallyNative(_, repetitions, direction, shift);
}

/**
 * Select horizontally.
 *
 * @param avoidEol If `true`, selections will automatically skip to the next
 *   line instead of going after the last character. Does not skip empty lines.
 *
 * #### Variants
 *
 * | Title        | Identifier     | Keybinding                                                                                         | Command                                                             |
 * | ------------ | -------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
 * | Jump right   | `right.jump`   | `l` (core: normal)  , `right` (core: normal)                                                       | `[".select.horizontally", { direction:  1, shift: "jump"  , ... }]` |
 * | Extend right | `right.extend` | `s-l` (kakoune: normal), `s-right` (kakoune: normal), `l` (helix: select), `right` (helix: select) | `[".select.horizontally", { direction:  1, shift: "extend", ... }]` |
 * | Jump left    | `left.jump`    | `h` (core: normal)  , `left` (core: normal)                                                        | `[".select.horizontally", { direction: -1, shift: "jump"  , ... }]` |
 * | Extend left  | `left.extend`  | `s-h` (kakoune: normal), `s-left` (kakoune: normal), `h` (helix: select), `left` (helix: select)   | `[".select.horizontally", { direction: -1, shift: "extend", ... }]` |
 */
export function horizontally(
  _: Context,

  avoidEol: Argument<boolean> = false,
  repetitions: number,
  direction = Direction.Forward,
  shift = Shift.Select,
) {
  const mayNeedAdjustment = direction === Direction.Backward
                         && _.selectionBehavior === SelectionBehavior.Character;

  const newSelections = Selections.mapByIndex((_i, selection, document) => {
    let active = selection.active === selection.start
      ? Selections.activeStart(selection, _)
      : Selections.activeEnd(selection, _);

    if (mayNeedAdjustment) {
      if (shift === Shift.Extend && Selections.isSingleCharacter(selection)) {
        active = selection.start;
      } else if (shift === Shift.Jump && selection.active === selection.start) {
        active = Positions.next(active, _.document) ?? active;
      }
    }

    let target = Positions.offset(active, direction * repetitions, document) ?? active;

    if (avoidEol) {
      switch (_.selectionBehavior) {
      case SelectionBehavior.Caret:
        if (target.character === Lines.length(target.line, document) && target.character > 0) {
          target = Positions.offset(target, direction, document) ?? target;
        }
        break;

      case SelectionBehavior.Character:
        if (target.character === 0
            && (direction === Direction.Forward || target.line === 0
                || !Lines.isEmpty(target.line - 1, document))) {
          target = Positions.offset(target, direction, document) ?? target;
        }
        break;
      }
    }

    return Selections.shift(selection, target, shift);
  });

  if (_.selectionBehavior === SelectionBehavior.Character) {
    Selections.shiftEmptyLeft(newSelections, _.document);
  }

  Selections.set(newSelections);
}

/**
 * Select to.
 *
 * If a count is specified, this command will shift to the start of the given
 * line. If no count is specified, this command will shift open the `goto` menu.
 *
 * #### Variants
 *
 * | Title     | Identifier  | Keybinding              | Command                                    |
 * | --------- | ----------- | ----------------------- | ------------------------------------------ |
 * | Go to     | `to.jump`   | `g` (kakoune: normal)   | `[".select.to", { shift: "jump"  , ... }]` |
 * | Extend to | `to.extend` | `s-g` (kakoune: normal) | `[".select.to", { shift: "extend", ... }]` |
 */
export function to(
  _: Context,
  count: number,
  argument: object,
  shift = Shift.Select,
) {
  if (count === 0) {
    // TODO: Make just merely opening the menu not count as a command execution
    // and do not record it.
    return showMenuByName("goto", [argument]);
  }

  return lineStart(_, count, shift);
}

/**
 * Select line below.
 */
export function line_below(_: Context, count: number) {
  if (count === 0 || count === 1) {
    Selections.updateByIndex((_, selection) => {
      let line = Selections.activeLine(selection);

      if (Selections.isEntireLines(selection) && !selection.isReversed) {
        line++;
      }

      return new vscode.Selection(line, 0, line + 1, 0);
    });
  } else {
    Selections.updateByIndex((_, selection, document) => {
      const lastLine = document.lineCount - 1;
      let line = Math.min(Selections.activeLine(selection) + count - 1, lastLine);

      if (Selections.isEntireLines(selection) && line < lastLine) {
        line++;
      }

      return new vscode.Selection(line, 0, line + 1, 0);
    });
  }
}

/**
 * Extend to line below.
 *
 * @keys `x` (helix: normal; helix: select)
 */
export function line_below_extend(_: Context, count: number) {
  if (count === 0 || count === 1) {
    Selections.updateByIndex((_, selection, document) => {
      const isFullLine = Selections.endsWithEntireLine(selection),
            isSameLine = Selections.isSingleLine(selection),
            isFullLineDiff = isFullLine && !(isSameLine && selection.isReversed) ? 1 : 0,
            activeLine = Selections.activeLine(selection);

      const anchor = isSameLine ? Positions.lineStart(activeLine) : selection.anchor,
            active = Positions.lineBreak(activeLine + isFullLineDiff, document);

      return new vscode.Selection(anchor, active);
    });
  } else {
    Selections.updateByIndex((_, selection, document) => {
      const activeLine = Selections.activeLine(selection),
            line = Math.min(activeLine + count - 1, document.lineCount - 1),
            isSameLine = Selections.isSingleLine(selection);

      const anchor = isSameLine ? Positions.lineStart(activeLine) : selection.anchor,
            active = Positions.lineBreak(line, document);

      return new vscode.Selection(anchor, active);
    });
  }
}

/**
 * Select line above.
 */
export function line_above(_: Context, count: number) {
  if (count === 0 || count === 1) {
    Selections.updateByIndex((_, selection) => {
      let line = Selections.activeLine(selection);

      if (!Selections.isEntireLines(selection)) {
        line++;
      }

      return new vscode.Selection(line, 0, line - 1, 0);
    });
  } else {
    Selections.updateByIndex((_, selection) => {
      let line = Math.max(Selections.activeLine(selection) - count + 1, 0);

      if (!Selections.isEntireLines(selection)) {
        line++;
      }

      return new vscode.Selection(line, 0, line - 1, 0);
    });
  }
}

/**
 * Extend to line above.
 */
export function line_above_extend(_: Context, count: number) {
  if (count === 0 || count === 1) {
    Selections.updateByIndex((_, selection) => {
      if (selection.isSingleLine) {
        let line = Selections.activeLine(selection);

        if (!Selections.isEntireLines(selection)) {
          line++;
        }

        return new vscode.Selection(line, 0, line - 1, 0);
      }

      if (selection.active === selection.end && Selections.isEntireLine(selection)) {
        const line = Selections.activeLine(selection);

        return new vscode.Selection(line + 1, 0, line - 1, 0);
      }

      const isFullLine = Selections.activeLineIsFullySelected(selection),
            isFullLineDiff = isFullLine ? -1 : 0,
            active = new vscode.Position(Selections.activeLine(selection) + isFullLineDiff, 0);

      return new vscode.Selection(selection.anchor, active);
    });
  } else {
    Selections.updateByIndex((_, selection, document) => {
      let line = Math.max(Selections.activeLine(selection) - count, 0),
          anchor = selection.anchor;

      if (selection.active === selection.end) {
        anchor = selection.active;
      }

      if (selection.isSingleLine) {
        anchor = Positions.lineBreak(selection.anchor.line, document);
        line++;
      } else if (!Selections.startsWithEntireLine(selection)) {
        line++;
      }

      return new vscode.Selection(anchor, new vscode.Position(line, 0));
    });
  }
}

/**
 * Select to line start.
 *
 * @keys `a-h` (kakoune: normal), `home` (core: normal)
 *
 * #### Variants
 *
 * | Title                             | Identifier                   | Keybinding                                                                    | Command                                                            |
 * | --------------------              | ------------------           | ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
 * | Jump to line start                | `lineStart.jump`             |                                                                               | `[".select.lineStart", {                  shift: "jump"  , ... }]` |
 * | Extend to line start              | `lineStart.extend`           | `s-a-h` (kakoune: normal), `s-home` (kakoune: normal), `home` (helix: select) | `[".select.lineStart", {                  shift: "extend", ... }]` |
 * | Jump to line start (skip blank)   | `lineStart.skipBlank.jump`   |                                                                               | `[".select.lineStart", { skipBlank: true, shift: "jump"  , ... }]` |
 * | Extend to line start (skip blank) | `lineStart.skipBlank.extend` |                                                                               | `[".select.lineStart", { skipBlank: true, shift: "extend", ... }]` |
 * | Jump to first line                | `firstLine.jump`             |                                                                               | `[".select.lineStart", { count: 0,        shift: "jump"  , ... }]` |
 * | Extend to first line              | `firstLine.extend`           |                                                                               | `[".select.lineStart", { count: 0,        shift: "extend", ... }]` |
 */
export function lineStart(
  _: Context,

  count: number,
  shift = Shift.Select,
  skipBlank = false,
) {
  if (count > 0) {
    const selection = _.selections[0],
          newLine = Math.min(_.document.lineCount, count) - 1,
          newPosition = skipBlank
            ? Positions.nonBlankLineStart(newLine, _.document)
            : Positions.lineStart(newLine),
          newSelection = Selections.shift(selection, newPosition, shift);

    Selections.set([newSelection]);

    return;
  }

  Selections.updateByIndex((_, selection) =>
    Selections.shift(
      selection,
      skipBlank
        ? Positions.nonBlankLineStart(Selections.activeLine(selection))
        : Positions.lineStart(Selections.activeLine(selection)),
      shift,
    ),
  );
}

/**
 * Select to line end.
 *
 * @param lineBreak If `true`, selects the line break in character selection
 *   mode.
 *
 * @keys `a-l` (kakoune: normal), `end` (core: normal)
 *
 * #### Variants
 *
 * | Title                    | Identifier           | Keybinding                                                                  | Command                                                         |
 * | ------------------------ | -------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
 * | Extend to line end       | `lineEnd.extend`     | `s-a-l` (kakoune: normal), `s-end` (kakoune: normal), `end` (helix: select) | `[".select.lineEnd", {                 shift: "extend", ... }]` |
 * | Jump to last character   | `documentEnd.jump`   |                                                                             | `[".select.lineEnd", { count: MAX_INT, shift: "jump"  , ... }]` |
 * | Extend to last character | `documentEnd.extend` |                                                                             | `[".select.lineEnd", { count: MAX_INT, shift: "extend", ... }]` |
 */
export function lineEnd(
  _: Context,

  count: number,
  shift = Shift.Select,
  lineBreak = false,
) {
  const mapSelection = (selection: vscode.Selection, newLine: number) => {
    const newActive = Positions.lineEnd(newLine);

    if (_.selectionBehavior === SelectionBehavior.Character && shift === Shift.Jump) {
      if (lineBreak) {
        return Selections.from(newActive, Positions.next(newActive, _.document) ?? newActive);
      } else {
        return Selections.from(Positions.previous(newActive, _.document) ?? newActive, newActive);
      }
    }

    return Selections.shift(selection, newActive, shift);
  };

  if (count > 0) {
    const newLine = Math.min(_.document.lineCount, count) - 1;

    Selections.set([mapSelection(_.mainSelection, newLine)]);

    return;
  }

  Selections.updateByIndex((_, selection) =>
    mapSelection(selection, Selections.activeLine(selection)),
  );
}

/**
 * Select to nth line
 */
export function nthLine(_: Context, count: number, shift = Shift.Select) {
  const line = Lines.clamp(count - 1, _.document);
  Selections.set([Selections.shift(_.mainSelection, Positions.lineStart(line), shift)]);
}

/**
 * Select to last line.
 *
 * #### Variants
 *
 * | Title               | Identifier        | Command                                     |
 * | ------------------- | ----------------- | ------------------------------------------- |
 * | Jump to last line   | `lastLine.jump`   | `[".select.lastLine", { shift: "jump"   }]` |
 * | Extend to last line | `lastLine.extend` | `[".select.lastLine", { shift: "extend" }]` |
 */
export function lastLine(_: Context, document: vscode.TextDocument, shift = Shift.Select) {
  let line = document.lineCount - 1;

  // In case of trailing line break, go to the second last line.
  if (line > 0 && document.lineAt(line).text.length === 0) {
    line--;
  }

  Selections.set([Selections.shift(_.mainSelection, Positions.lineStart(line), shift)]);
}

/**
 * Select to first visible line.
 *
 * #### Variants
 *
 * | Title                        | Identifier                | Command                                             |
 * | ---------------------------- | ------------------------- | --------------------------------------------------- |
 * | Jump to first visible line   | `firstVisibleLine.jump`   | `[".select.firstVisibleLine", { shift: "jump"   }]` |
 * | Extend to first visible line | `firstVisibleLine.extend` | `[".select.firstVisibleLine", { shift: "extend" }]` |
 */
export function firstVisibleLine(_: Context, shift = Shift.Select) {
  const selection = _.mainSelection,
        toPosition = Positions.lineStart(apiFirstVisibleLine(_.editor));

  Selections.set([Selections.shift(selection, toPosition, shift)]);
}

/**
 * Select to middle visible line.
 *
 * #### Variants
 *
 * | Title                         | Identifier                 | Command                                              |
 * | ----------------------------- | -------------------------- | ---------------------------------------------------- |
 * | Jump to middle visible line   | `middleVisibleLine.jump`   | `[".select.middleVisibleLine", { shift: "jump"   }]` |
 * | Extend to middle visible line | `middleVisibleLine.extend` | `[".select.middleVisibleLine", { shift: "extend" }]` |
 */
export function middleVisibleLine(_: Context, shift = Shift.Select) {
  const selection = _.mainSelection,
        toPosition = Positions.lineStart(apiMiddleVisibleLine(_.editor));

  Selections.set([Selections.shift(selection, toPosition, shift)]);
}

/**
 * Select to last visible line.
 *
 * #### Variants
 *
 * | Title                       | Identifier               | Command                                            |
 * | --------------------------- | ------------------------ | -------------------------------------------------- |
 * | Jump to last visible line   | `lastVisibleLine.jump`   | `[".select.lastVisibleLine", { shift: "jump"   }]` |
 * | Extend to last visible line | `lastVisibleLine.extend` | `[".select.lastVisibleLine", { shift: "extend" }]` |
 */
export function lastVisibleLine(_: Context, shift = Shift.Select) {
  const selection = _.mainSelection,
        toPosition = Positions.lineStart(apiLastVisibleLine(_.editor));

  Selections.set([Selections.shift(selection, toPosition, shift)]);
}
