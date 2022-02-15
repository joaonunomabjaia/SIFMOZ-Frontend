import { Model } from '@vuex-orm/core'
import PrescriptionDetail from '../prescriptionDetails/PrescriptionDetail'

export default class TherapeuticLine extends Model {
  static entity = 'therapeuticLines'
  static fields () {
    return {
      id: this.attr(null),
      code: this.attr(''),
      description: this.attr(''),
      prescriptionDetails: this.hasMany(PrescriptionDetail, 'therapeutic_line_id')
    }
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/therapeuticLine?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/therapeuticLine/${id}`)
  }
}
