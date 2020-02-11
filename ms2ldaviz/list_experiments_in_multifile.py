import os
import pickle
import numpy as np
import sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ms2ldaviz.settings")

import django
django.setup()


# This is to process files that have document names stored as mz_rt
# it extracts the acutal mz and rt from the name and adds them to the metadata
# This version works for multi-file experiments


import jsonpickle
import csv

from basicviz.models import MultiFileExperiment,Experiment,Document,PeakSet,IntensityInstance

if __name__ == '__main__':
	multifile_experiment_name = sys.argv[1]
	mfe = MultiFileExperiment.objects.get(name = multifile_experiment_name)
	links = mfe.multilink_set.all().order_by('experiment')
	for link in links:
		print(link.experiment)