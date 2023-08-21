from solarflare.models import FNDataset, File
import os
from datetime import datetime

def sizify(value):

    # value = ing(value)
    if value < 512000:
        value = value / 1024.0
        ext = 'KB'
    elif value < 4194304000:
        value = value / 1048576.0
        ext = 'MB'
    else:
        value = value / 1073741824.0
        ext = 'GB'
    return '%s %s' % (str(round(value, 2)), ext)


def save(id):
    id = id

    globalPath = 'C:/Users/eskan/solarFlare/backend'

    path = 'datasets/'

    now = datetime.now().strftime("%Y%M%D%H%M%S").replace('/', '')

    with open(path + 'train_graph_' + now + '.csv', 'w') as tp:
        pass

    with open(path + 'label_graph_' + now + '.csv', 'w') as lp:
        pass

    train_graph = ''
    label_graph = ''

    with open(path + 'train_graph_' + now + '.csv', 'r') as tp:
        train_graph = File.objects.create(data=path + 'train_graph_' + now + '.csv',
                                                 name='train_graph_' + now + '.csv')
        train_graph.volume = sizify(os.path.getsize(globalPath + train_graph.data.url))
        train_graph.save()

    with open(path + 'label_graph_' + now + '.csv', 'r') as lp:
        label_graph = File.objects.create(data=path + 'label_graph_' + now + '.csv',
                                                 name='label_graph_' + now + '.csv')
        label_graph.volume = sizify(os.path.getsize(globalPath + label_graph.data.url))
        label_graph.save()

    dataset = FNDataset.objects.get(id=id)
    dataset.status = 'completed'
    dataset.save()

    dataset.data.add(train_graph)
    dataset.data.add(label_graph)
    dataset.save()
