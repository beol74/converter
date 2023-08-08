import * as fs from 'fs'
import { DaMeteoGuillerieConverter } from '../dameteoguilleries-converter'

describe('Unit test for dameteguilleries', function () {
  it('converts sample file', async () => {
    const converter = new DaMeteoGuillerieConverter()
    const buff = fs.readFileSync('lib/dameteoguilleries/test/input.htm')
    const result = converter.convert(buff)

    expect(result.series[0].first.timestamp.toISOString()).toEqual(new Date('2023-06-14T13:40:00.000Z').toISOString())
    expect(result.series[0].values).toEqual([23.7, 23.8, 23.5, 23.4])
    expect(result.series[0].name).toEqual('temperaturaAra')
    expect(result.series[0].type).toEqual('NUMBER')

    expect(result.series[6].values).toEqual(['NNE', 'NNE', 'N', 'N'])
    expect(result.series[6].name).toEqual('ventDirAra')
    expect(result.series[6].type).toEqual('TEXT')
    expect(result.series[6].last.timestamp.toISOString()).toEqual(new Date('2023-06-14T13:55:00.000Z').toISOString())
  })
})
