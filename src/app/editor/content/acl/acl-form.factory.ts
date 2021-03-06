/*
 * Copyright (C) 2018  Ľuboš Kozmon
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

import {FormBuilder} from "@angular/forms";
import {ZNodeAcl, ZNodeMeta} from "../../../core";
import {Injectable} from "@angular/core";
import {AclForm} from "./acl-form";

@Injectable()
export class AclFormFactory {

  constructor(private formBuilder: FormBuilder) {
  }

  newForm(acl: ZNodeAcl, meta: ZNodeMeta): AclForm {
    return new AclForm(acl, meta, this.formBuilder);
  }
}
