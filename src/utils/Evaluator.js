import _ from 'lodash';
import stringHash from 'string-hash';
import { Evaluator as CoreEvaluator } from '@formio/core';

// @formio/core's BaseEvaluator/Evaluator expose noeval, templateSettings, interpolateString and
// evaluate as STATIC members only (see node_modules/@formio/core/lib/utils/Evaluator.js) — but this
// class is designed to be instantiated (see the `Evaluator` singleton below) and used throughout the
// wider codebase as `Evaluator.noeval`, `Evaluator.templateSettings`, `Evaluator.interpolateString(...)`
// and `Evaluator.evaluate(...)` on that INSTANCE (e.g. src/utils/i18n.js, src/utils/utils.js,
// src/Element.js, several components' editForm files). Static members aren't reachable via `this`/an
// instance regardless of inheritance, so without these delegating getters/methods every one of those
// call sites would see `undefined` (a silent no-op for the noeval/templateSettings reads, a hard
// "is not a function" crash for interpolateString/evaluate).
export class DefaultEvaluator extends CoreEvaluator {
  cache = {};
  protectedEval = false;

  get noeval() {
    return CoreEvaluator.noeval;
  }

  get templateSettings() {
    return CoreEvaluator.templateSettings;
  }

  interpolateString(...args) {
    return CoreEvaluator.interpolateString(...args);
  }

  evaluate(...args) {
    return CoreEvaluator.evaluate(...args);
  }

  template(template, hash) {
    hash = hash || stringHash(template);
    if (this.cache[hash]) {
      return this.cache[hash];
    }
    try {
      // Ensure we handle copied templates from the ejs files.
      template = template.replace(/ctx\./g, '');
      return (this.cache[hash] = _.template(template, this.templateSettings));
    }
    catch (err) {
      console.warn('Error while processing template', err, template);
    }
  }

  interpolate(rawTemplate, data, _options) {
    // Ensure reverse compatability.
    const options = _.isObject(_options) ? _options : { noeval: _options };
    if (typeof rawTemplate === 'function') {
      try {
        return rawTemplate(data);
      }
      catch (err) {
        console.warn('Error interpolating template', err, data);
        return err.message;
      }
    }

    rawTemplate = String(rawTemplate);
    let template;
    if (this.noeval || options.noeval) {
      return this.interpolateString(rawTemplate, data, _options);
    }
    else {
      template = this.template(rawTemplate);
    }
    if (typeof template === 'function') {
      try {
        return template(data);
      }
      catch (err) {
        console.warn('Error interpolating template', err, rawTemplate, data);
        return err.message;
      }
    }
    return template;
  }
}

export let Evaluator = new DefaultEvaluator();

// preserve the standalone interpolate function for backwards compatibility
/**
 * For backwards compatibility we a standalone interpolate function. This merely calls the
 * global mutable Evaluator instance's interpolate function.
 * @param  {...any} args - interpolate arguments, typically "rawTemplate", "data", and "options"
 * @returns {any} the interpolation result.
 */
export function interpolate(...args) {
  return Evaluator.interpolate(...args);
}

/**
 * Set the evaluator to use for evaluating expressions.
 * @param {CoreEvaluator} override - The new evaluator instance to use.
 * @returns {void}
 */
export function registerEvaluator(override) {
    Evaluator = override;
}
