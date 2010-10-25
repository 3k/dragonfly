﻿window.cls = window.cls || (window.cls = {});

/**
 * Escape Meta Alt Control Shift
 *
 */
cls.BufferManager = function(textarea)
{
  this._textarea = textarea;
  this.handle = function(evt) {
      return this._handle_event(evt);
  };

  this._handle_event = function(evt)
  {
    if (evt.ctrlKey)
    {
      switch (evt.keyCode)
      {
        case 97: // a key. ctrl-a == move to start of line
          this.move_to_beginning_of_line();
          return true;
        case 101: // e key. ctrl-e == move to end of line
          this.move_to_end_of_line();
          return true;
        case 107: // k key. ctrl-k == kill to end of line
          this.kill_to_end_of_line();
          return true;
        case 119: // w key. ctrl-w == kill word backwards
          this.kill_word_backwards();
          return true;
      }
    }
    return false;
  };

  this.move_to_beginning_of_line = function()
  {
    this.put_cursor(0);
  };

  this.move_to_end_of_line = function()
  {
    this.put_cursor(this._textarea.value.length);
  };

  this.kill_to_end_of_line = function()
  {
    var pos = this._textarea.selectionStart;
    this._textarea.value = this._textarea.value.slice(0, pos);
  };

  this.kill_word_backwards = function()
  {
    var textarea = this._textarea;
    var str_before_cursor = textarea.value.slice(0, textarea.selectionStart);
    var char_before_cursor = str_before_cursor[str_before_cursor.length-1];
    var new_str_before_cursor = "";
    var replace_regexp = "";

    /**
     * Word boundaries are whitespace and non-alphanumeric characters
     */

    // Somewhat VIM inspired
    if (/\s/.test(char_before_cursor))
    {
      replace_regexp = /\w*\s+$/;
    }
    else if (/\w$/.test(char_before_cursor))
    {
      replace_regexp = /\s*\w+$/;
    }
    else if (/\W$/.test(char_before_cursor))
    {
      replace_regexp = /\W+$/;
    }

    new_str_before_cursor = str_before_cursor.replace(replace_regexp, "");
    textarea.value = new_str_before_cursor +
                     textarea.value.slice(textarea.selectionStart);
    this.put_cursor(new_str_before_cursor.length);
  };

  this.put_cursor = function(offset)
  {
    this._textarea.selectionStart = offset;
    this._textarea.selectionEnd = offset;
  };

  this.get_cursor = function()
  {
    return this._textarea.selectionStart;
  };

  this.set_value = function(value, cursorpos)
  {
    this._textarea.value = value;
    if (cursorpos !== undefined)
    {
      this.put_cursor(cursorpos);
    }
  };

  this.get_value = function(start, end)
  {
    if (start === undefined)
    {
      return this._textarea.value;
    }
    else if (end === undefined)
    {
      return this._textarea.value.slice(start);
    }
    else
    {
      return this._textarea.value.slice(start, end);
    }
  };

  this.clear = function()
  {
    this.set_value("");
  };
}