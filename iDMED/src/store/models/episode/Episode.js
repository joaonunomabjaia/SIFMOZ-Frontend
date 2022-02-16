import { Model } from '@vuex-orm/core'
import ClinicSector from '../clinicSector/ClinicSector'
import EpisodeType from '../episodeType/EpisodeType'
import PatientProgramIdentifier from '../patientServiceIdentifier/PatientServiceIdentifier'
import PatientVisitDetails from '../patientVisitDetails/PatientVisitDetails'
import StartStopReason from '../startStopReason/StartStopReason'

export default class Episode extends Model {
  static entity = 'episodes'

  static fields () {
    return {
      id: this.attr(null),
      episodeDate: this.attr(''),
      notes: this.attr(''),
      creationDate: this.attr(''),
      episodeType_id: this.attr(''),
      clinicSector_id: this.attr(''),
      patientServiceIdentifier_id: this.attr(''),
      startStopReason_id: this.attr(''),
      isLast: this.boolean(false),
      // Relationships
      startStopReason: this.belongsTo(StartStopReason, 'startStopReason_id'),
      episodeType: this.belongsTo(EpisodeType, 'episodeType_id'),
      clinicSector: this.belongsTo(ClinicSector, 'clinicSector_id'),
      patientServiceIdentifier: this.belongsTo(PatientProgramIdentifier, 'patientServiceIdentifier_id'),
      patientVisitDetails: this.hasMany(PatientVisitDetails, 'episode_id')
    }
  }

  closed () {
    if (this.episodeType === null) return false
    return this.episodeType.code === 'FIM'
  }

  isStartEpisode () {
    if (this.episodeType === null) return false
    return this.episodeType.code === 'INICIO'
  }

  isCloseEpisode () {
    if (this.episodeType === null) return false
    return this.episodeType.code === 'FIM'
  }

  hasVisits () {
    return this.patientVisitDetails.length > 0
  }

  lastVisit () {
    let lastVisit = null
    this.patientVisitDetails.forEach((visit) => {
      if (lastVisit === null) {
        lastVisit = visit
      } else if (visit.patientVisit.visitDate > lastVisit.patientVisit.visitDate) {
        lastVisit = visit
      }
    })
    return lastVisit
  }

  static async apiSave (episode) {
    return await this.api().post('/episode', episode)
  }

  static async apiRemove (episode) {
    return await this.api().delete('/episode', episode)
  }

  static async apiGetAllByClinicId (clinicId, offset, max) {
    return await this.api().get('/episode/clinic/' + clinicId + '?offset=0&max=100')
  }

  static async apiFetchById (id) {
    return await this.api().get(`/episode/${id}`)
  }

  static async apiGetAllByIdentifierId (identifierId, offset, max) {
    return await this.api().get('/episode/identifier/' + identifierId + '?offset=0&max=100')
  }
}
