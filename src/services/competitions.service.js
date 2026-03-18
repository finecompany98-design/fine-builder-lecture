import {
  collection, getDocs, getDoc, doc,
  query, where, orderBy, limit, addDoc, writeBatch
} from 'firebase/firestore'
import { db } from './firebase'

const COL = 'competitions'

/** 전체 목록 조회 (필터 옵션) */
export async function getCompetitions({ category, type, field } = {}) {
  const constraints = [where('isActive', '==', true)]

  if (category && category !== '전체') {
    constraints.push(where('category', '==', category))
  }
  if (type && type !== '전체') {
    constraints.push(where('type', '==', type))
  }

  constraints.push(orderBy('deadline'))

  const q = query(collection(db, COL), ...constraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

/** 단건 조회 */
export async function getCompetition(id) {
  const snap = await getDoc(doc(db, COL, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/** 시드 데이터 일괄 등록 (최초 1회 실행) */
export async function seedCompetitions(items) {
  const batch = writeBatch(db)
  items.forEach(item => {
    const ref = doc(collection(db, COL))
    batch.set(ref, item)
  })
  await batch.commit()
}
