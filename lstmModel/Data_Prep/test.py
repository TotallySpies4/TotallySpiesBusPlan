import pandas


t = pandas.read_csv('2023-01-09_resampled.csv')
t2 = pandas.read_csv('trainData3.csv')
trainData = pandas.concat([t2, t])
trainData = trainData.dropna()
trainData.sort_values(by=['Trip ID_first', 'Segment_first'], inplace=True)
trainData.to_csv('trainData4.csv', index=False)



