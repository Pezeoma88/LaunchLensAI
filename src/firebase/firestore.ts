import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function saveReport(uid: string, report: any) {
  await addDoc(
    collection(db, "users", uid, "reports"),
    {
      ...report,
      createdAt: serverTimestamp(),
    }
  );
}