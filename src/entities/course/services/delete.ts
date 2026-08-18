import { sendDeleteCourse as invokeDelete } from '../api/delete'

export async function deleteCourse(id: string): Promise<void> {
  await invokeDelete(id)
}
