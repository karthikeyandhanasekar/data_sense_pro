/**
 * API URL constants
 *
 * This object contains constants for API URLs used in the application.
 */
export const apiUrl = {
  /**
   * Login API URL
   *
   * @example `/login`
   */
  login: `\\login`,
  /**
   * Register API URL
   *
   * @example `/register`
   */
  register: `\\register`,
  /**
   * Command API URLs
   *
   * This object contains functions that generate API URLs for CRUD operations.
   */
  cmd: {
    /**
     * Get URL for adding a new record
     *
     * @param {string} tableName - Name of the table to add a record to
     * @returns {string} URL for adding a new record
     * @example `/addRecord?tableName=users`
     */
    getUrl: `/api/mapping-sector-classifications/manage?action=get`,

    getbyIDurl : (id) =>`/api/mapping-sector-classifications/${id}`,
    /**
     * Post URL for adding a new record
     *
     * @param {string} tableName - Name of the table to add a record to
     * @returns {string} URL for adding a new record
     * @example `/addRecord?tableName=users`
     */
    postUrl: `api/mapping-sector-classifications/manage?action=create`,
    /**
     * Put URL for updating a record
     *
     * @param {string} tableName - Name of the table to update a record in
     * @param {number} id - ID of the record to update
     * @returns {string} URL for updating a record
     * @example `/updateRecord?tableName=users&id=1`
     */
    putUrl: (id) =>
      `api/mapping-sector-classifications/manage?action=update&id=${id}`,
    /**
     * Remove URL for deleting a record
     *
     * @param {string} tableName - Name of the table to delete a record from
     * @param {number} id - ID of the record to delete
     * @returns {string} URL for deleting a record
     * @example `/deleteRecord?tableName=users&id=1`
     */
    removeUrl: (id) =>
      `api/mapping-sector-classifications/manage?action=delete&id=${id}`,
  },
};
