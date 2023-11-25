import pandas


t = pandas.read_csv('trainData1.csv')

trainData = t.to_csv('trainData3.csv', index=False)




