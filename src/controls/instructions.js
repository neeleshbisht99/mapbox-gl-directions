import format from '../format';
import template from 'lodash.template';

let fs = require('fs'); // substack/brfs#39
let tmpl = template(fs.readFileSync(__dirname + '/../templates/instructions.html', 'utf8'));

/**
 * Summary/Instructions controller
 *
 * @param {HTMLElement} el Summary parent container
 * @param {Object} store A redux store
 * @param {Actions} actions Actions an element can dispatch
 * @private
 */
export default class Instructions {
  constructor(el, store, actions) {

    this.container = el;
    this.actions = actions;
    this.render(store);
  }

  render(store) {
    store.subscribe(() => {
      const { routeIndex, unit, directions } = store.getState();
      const direction = directions[routeIndex];

      if (directions.length) {
        let steps = direction.steps.map((step) => {
          step.distance = step.distance ? format[unit](step.distance) : '';
          step.icon = step.maneuver.type.replace(/\s+/g, '-').toLowerCase();
          return step;
        });

        this.container.innerHTML = tmpl({
          routeIndex,
          steps: steps,
          duration: format[unit](direction.duration),
          distance: format.duration(direction.distance)
        });
      }
    });
  }
}
