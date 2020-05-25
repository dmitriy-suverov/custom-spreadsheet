import { Page } from "../core/routes/Page";
import { $, Dom } from "../core/dom";
import { Store, AppState } from "../core/Store";
import { getFromStorage } from "../core/utils";

export class DashboardPage extends Page {
  getRoot(): Dom {
    const newTableId = Date.now();
    const tables = this.getAllTables();
    return $.create("div", "db").html(
      `
            <div class="db__header">
              <h1>Spreedsheet-app dashboard</h1>
            </div>

            <div class="db__new">
              <div class="db__view">
                <a href="#excel/${newTableId}" class="db__create">
                  New <br />
                  Table
                </a>
              </div> 
            </div>

            ${this.renderTableList(tables)}
            
            `
    ) as Dom;
  }

  // todo rename appstate->tablestate
  private getAllTables(): AppState[] {
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith(Store.STORAGE_KEY)) {
        result.push(getFromStorage(key));
      }
    }

    return result;
  }

  private renderTableList(tables: AppState[] = []): string {
    if (tables.length === 0) {
      return `
      <p>You haven't created any table yeat</p>
      `;
    }

    return `
      <div class="db__table db__view">
      <div class="db__list-header">
        <span>Name</span>
        <span>Created at</span>
      </div>
        ${this.renderTableListContent(tables)}
      </div>
   `;
  }

  private renderTableListContent(tables: AppState[] = []): string {
    return `
       <ul class="db__list">
        ${tables
          .map((tableData, idx) => this.renderTableListItem(tableData, idx + 1))
          .join("")}
      </ul>
    `;
  }

  private renderTableListItem(tableData: AppState, number: number): string {
    return `
      <li class="db__record">
        <a href="#excel/${tableData.tableId}">Table № ${number} - ${
      tableData.tableName
    }</a>
        <strong>${new Date(tableData.createdAt).toLocaleDateString()}</strong>
      </li>
    `;
  }
}
