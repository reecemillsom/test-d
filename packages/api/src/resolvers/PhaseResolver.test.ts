import { PhaseResolver } from './PhaseResolver';

describe('PhaseResolver', () => {
  describe('getPhase', () => {
    let mockPhaseRepo: any;
    let phaseResolver: PhaseResolver;
    beforeAll(() => {
      mockPhaseRepo = {
        get: jest.fn().mockResolvedValue({
          _id: 'someId',
          name: 'Phase 1',
          phaseNo: 1,
        }),
      };

      phaseResolver = new PhaseResolver(mockPhaseRepo);
    });

    it('will return the correct document', async () => {
      const result = await phaseResolver.getPhase('someId');

      expect(result).toEqual({
        _id: 'someId',
        name: 'Phase 1',
        phaseNo: 1,
      });
    });
  });

  describe('getPhases', () => {
    let mockPhaseRepo: any;
    let phaseResolver: PhaseResolver;
    beforeAll(() => {
      mockPhaseRepo = {
        list: jest.fn().mockResolvedValue([
          {
            _id: 'someId',
            name: 'Phase 1',
            phaseNo: 1,
          },
          {
            _id: 'someId2',
            name: 'Phase 2',
            phaseNo: 2,
          },
        ]),
      };

      phaseResolver = new PhaseResolver(mockPhaseRepo);
    });

    it('will return the correct documents', async () => {
      const result = await phaseResolver.getPhases();

      expect(result).toEqual([
        {
          _id: 'someId',
          name: 'Phase 1',
          phaseNo: 1,
        },
        {
          _id: 'someId2',
          name: 'Phase 2',
          phaseNo: 2,
        },
      ]);
    });
  });
});
