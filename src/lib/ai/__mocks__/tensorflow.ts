const tf = {
  loadLayersModel: jest.fn().mockResolvedValue({
    predict: jest.fn()
  }),
  zeros: jest.fn().mockReturnValue({
    arraySync: jest.fn().mockReturnValue([0.5])
  }),
  metrics: {
    cosineProximity: jest.fn().mockReturnValue({
      arraySync: jest.fn().mockReturnValue(0.5)
    })
  }
};

export default tf;
