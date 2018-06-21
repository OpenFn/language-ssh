/** @module Adaptor */
import {
  execute as commonExecute,
  expandReferences,
  composeNextState,
} from 'language-common';
import node_ssh from 'node-ssh';

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @function
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */
export function execute(...operations) {
  const initialState = {
    references: [],
    data: null,
  };

  return state =>
    commonExecute(...operations)({ ...initialState, ...state });
}

/**
 * Get a file from a filepath
 * @public
 * @example
 *  get("/some/path/to_file.csv")
 * @function
 * @param {string} path - Path to resource
 * @returns {Operation}
 */
export function command(string) {
  return (state) => {

    const ssh = new node_ssh()

    const {
      host,
      username,
      password,
      port,
    } = state.configuration;

    return ssh.connect({
      host,
      username,
      privateKey: `/home/${username}/.ssh/id_rsa`,
    })
    .then(() => {
      return ssh.execCommand('hh_client --json', { cwd:'/var/www' })
        .then((result) => {
          console.log('STDOUT: ' + result.stdout)
          console.log('STDERR: ' + result.stderr)
        })
    })
    .then(() => {
      ssh.dispose()
    })

  }
}

export {
  alterState,
  dataPath,
  dataValue,
  each,
  field,
  fields,
  lastReferenceValue,
  merge,
  sourceValue,
} from 'language-common';
