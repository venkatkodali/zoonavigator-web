/*
 * Copyright (C) 2017  Ľuboš Kozmon
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Component, EventEmitter, Input, Output, ViewContainerRef} from "@angular/core";
import {state, style, trigger} from "@angular/animations";
import {ZNodeService, ZPath} from "../../core";
import {Observable} from "rxjs/Rx";
import {Ordering} from "../ordering";
import {DialogService} from "../../core/dialog/dialog.service";

@Component({
  selector: "zoo-editor-nav-actions",
  templateUrl: "nav-actions.component.html",
  styleUrls: ["nav-actions.component.scss"],
  animations: [
    trigger("flippedState", [
      state("default", style({transform: "scale(1, 1)"})),
      state("flipped", style({transform: "scale(1, -1) translate(0, -2px)"}))
    ])
  ]
})
export class NavActionsComponent {

  @Output() selectAll: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();

  @Input() zPath: ZPath;
  @Input() zNodes: ZPath[];

  @Input() ordering: Ordering;
  @Output() orderingChange = new EventEmitter<Ordering>();

  toggleSortButtonFlippedState = "flipped";

  constructor(
    private zNodeService: ZNodeService,
    private dialogService: DialogService,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  onSelectAllClick(): void {
    this.selectAll.emit();
  }

  onToggleSortClick(): void {
    let newOrdering: Ordering;

    if (this.ordering === Ordering.Descending) {
      newOrdering = Ordering.Ascending;
      this.toggleSortButtonFlippedState = "flipped";
    } else {
      newOrdering = Ordering.Descending;
      this.toggleSortButtonFlippedState = "default";
    }

    this.ordering = newOrdering;
    this.orderingChange.emit(newOrdering);
  }

  onCreateClick(): void {
    this.dialogService
      .showPrompt(
        "Create node",
        "Type in new node path",
        "Create",
        "Cancel",
        this.viewContainerRef,
        this.zPath.isRoot ? "/" : this.zPath.path.concat("/")
      )
      .switchMap(ref => ref.afterClosed())
      .switchMap((path: string) => {
        if (path) {
          return this.zNodeService
            .createNode(path)
            .catch(err => this.dialogService.showErrorAndThrowOnClose(err, this.viewContainerRef))
            .map(() => this.refresh.emit());
        }

        return Observable.empty<void>();
      })
      .subscribe();
  }

  onDeleteClick(): void {
    const path = this.zPath.path;
    const names = this.zNodes.map(node => node.name);

    const message = `Do you want to delete ${names.length} ${names.length === 1 ? "node and its" : "nodes and their"} children?`;

    this.dialogService
      .showConfirm(
        "Confirm recursive delete",
        message,
        "Delete",
        "Cancel",
        this.viewContainerRef
      )
      .switchMap(ref => ref.afterClosed())
      .switchMap((confirm: boolean) => {
        if (confirm) {
          return this.zNodeService
            .deleteChildren(path, names.map(name => name.valueOrThrow()))
            .catch(err => this.dialogService.showErrorAndThrowOnClose(err, this.viewContainerRef))
            .map(() => this.refresh.emit());
        }

        return Observable.empty<void>();
      })
      .subscribe();
  }
}
