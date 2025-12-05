import { RelationShipStatus } from "../constants/CommonConstants";
export function mapRelationshipObject(key) {
    return RelationShipStatus[key] || null;
}