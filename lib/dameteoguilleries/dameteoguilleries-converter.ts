import { JtsDocument, TimeSeries } from '@eagle-io/timeseries'
import { Converter } from '../../converter'

/**
 * Convert the JSON data encapsulated in Meteo Guilleries network webpages (Catalunya Spain)
 * exemple : https://www.meteoguilleries.cat/ca/estacions/shs2.html
 *
 *
 */
export class DaMeteoGuillerieConverter extends Converter {
  convert (input: Buffer): JtsDocument {
    const series: {
      [key: string]: any
    } = {}

    // Get the records contained in var arrayDades10
    const dataset = input.toString('utf-8')
    const records = JSON.parse(dataset.substr(dataset.indexOf('arrayDades10 = ') + 15, dataset.indexOf('}];') - dataset.indexOf('arrayDades10 = ') - 13))

    // list parameters to exclude and String type parameters
    const ExclKey = ['id', 'idEstacioMeteo', 'data']
    const TextKey = ['ventDirAra', 'ventDirMax']

    // Create JTS series for each parameter of records[0]
    Object.keys(records[0]).forEach(function (key) {
      if (!(ExclKey.includes(key))) {
        series[key] = new TimeSeries({ name: key, type: TextKey.includes(key) ? 'TEXT' : 'NUMBER' })
      }
    })

    // Iterate over each record and convert to eagle-io's format
    for (var i = 0; i < records.length; i++) {
      const ts = this.dayjs.tz(records[i].data, 'UTC')
      Object.keys(records[i]).forEach(function (key) {
        if (!(ExclKey.includes(key))) {
          series[key].insert({ timestamp: ts, value: TextKey.includes(key) ? records[i][key] : Number(records[i][key]) })
        }
      })
    }

    return new JtsDocument({ series: Object.values(series) })
  }
}
