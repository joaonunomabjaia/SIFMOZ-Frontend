import { Model } from '@vuex-orm/core'
import Form from '../form/Form'
import PackagedDrug from '../packagedDrug/PackagedDrug'
import PackagedDrugStock from '../packagedDrug/PackagedDrugStock'
import Stock from '../stock/Stock'
// import TherapeuticRegimen from '../therapeuticRegimen/TherapeuticRegimen'

export default class Drug extends Model {
  static entity = 'drugs'

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr(''),
      fnmCode: this.attr(''),
      // sideTreatment: this.attr(''),
      packSize: this.attr(''),
      // clinicalStage: this.attr(''),
      defaultTimes: this.attr(''),
      defaultTreatment: this.attr(''),
      defaultPeriodTreatment: this.attr(''),
      active: this.boolean(true),
      form_id: this.attr(''),
      // Relationships
      form: this.belongsTo(Form, 'form_id'),
     // therapeutic_regimens: this.hasMany(TherapeuticRegimen, 'drug_id'),
      packaged_drugs: this.hasMany(PackagedDrug, 'drug_id'),
      packagedDrugStocks: this.hasMany(PackagedDrugStock, 'drug_id'),
      stocks: this.hasMany(Stock, 'drug_id')
    }
  }

  getCurStockAmount () {
    if (this.stocks.length <= 0) return 0
    let curStock = 0
    Object.keys(this.stocks).forEach(function (i) {
      curStock = curStock + this.stocks[i].stockMoviment
    }.bind(this))
    return curStock
  }

  getMonthAVGConsuption () {
    if (this.packaged_drugs.length <= 0) return 0
    let qtyConsumed = 0
    Object.keys(this.packaged_drugs).forEach(function (i) {
      qtyConsumed = qtyConsumed + this.packaged_drugs[i].quantitySupplied
    }.bind(this))
    return Math.round(Number(qtyConsumed / 3))
  }

  getConsuptionState () {
    const currStock = this.getCurStockAmount()
    const quantityDispensed = this.getQuantityDispensed()
    if (quantityDispensed > currStock) {
      return 'Ruptura de Stock'
    } else if (quantityDispensed < currStock) {
      return 'Acima do Consumo Máximo'
    } else {
      return 'Stock Normal'
    }
  }

  getConsuptionRelatedColor () {
    const currStock = this.getCurStockAmount()
    const quantityDispensed = this.getQuantityDispensed()
    if (quantityDispensed > currStock) {
      return 'red'
    } else if (quantityDispensed < currStock) {
      return 'info'
    } else {
      return 'primary'
    }
  }

  getQuantityDispensed () {
    let quantityDispensed = 0
    this.packaged_drugs.forEach((item) => {
      quantityDispensed = quantityDispensed + item.quantitySupplied
    })
    return quantityDispensed
  }

  static async apiGetAll (offset, max) {
    return await this.api().get('/drug?offset=' + offset + '&max=' + max)
  }

  static async apiFetchById (id) {
    return await this.api().get(`/drug/${id}`)
  }

  static async apiSave (drug) {
    return await this.api().post('/drug', drug)
  }
}
