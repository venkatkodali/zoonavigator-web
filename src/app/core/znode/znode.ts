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

import {ZNodeAcl} from "./znode-acl";
import {ZNodePath} from "./znode-path";
import {ZNodeData} from "./znode-data";
import {ZNodeMeta} from "./znode-meta";

export interface ZNode {
  acl: ZNodeAcl;
  path: ZNodePath;
  data: ZNodeData;
  meta: ZNodeMeta;
}
