import pandas

resampled_df = pandas.read_csv('resampled_df1.csv')
t = pandas.read_csv('trainData.csv')

trainData = pandas.concat([t, resampled_df])
trainData.to_csv('trainData1.csv')




print (trainData.shape[0])