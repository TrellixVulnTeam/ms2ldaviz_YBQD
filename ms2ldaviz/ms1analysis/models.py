from __future__ import unicode_literals

from django.db import models
from basicviz.models import Document, Experiment, Mass2Motif
from basicviz.constants import EXPERIMENT_STATUS_CODE
from decomposition.models import Decomposition, GlobalMotif

## tables for LDA experiment
class Sample(models.Model):
    name = models.CharField(max_length=128)
    experiment = models.ForeignKey(Experiment, on_delete=models.CASCADE)

class DocSampleIntensity(models.Model):
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    intensity = models.FloatField(null=True)

class Analysis(models.Model):
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=1024)
    experiment = models.ForeignKey(Experiment, on_delete=models.CASCADE)
    group1 = models.CharField(max_length=2048)
    group2 = models.CharField(max_length=2048)
    ready_code, _ = EXPERIMENT_STATUS_CODE[1]
    status = models.CharField(max_length=128, choices=EXPERIMENT_STATUS_CODE,
                              null=True, default=ready_code)
    use_logarithm = models.CharField(max_length=128, choices=[('N', 'No'), ('Y', 'Yes'),],
                              null=True, default='N')

class AnalysisResult(models.Model):
    analysis = models.ForeignKey(Analysis, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    pValue = models.FloatField(null=True)
    foldChange = models.FloatField(null=True)

class AnalysisResultPlage(models.Model):
    analysis = models.ForeignKey(Analysis, on_delete=models.CASCADE)
    mass2motif = models.ForeignKey(Mass2Motif, on_delete=models.CASCADE)
    plage_t_value = models.FloatField(null=True)
    plage_p_value = models.FloatField(null=True)

## tables for Decomposition
## currently just similar to LDA experiment settings, and change 'Experiment' to 'Decomposition'
## may avoid this duplication in the future

## decomposition shares the same idea of loading peaklist file and parsing it to databse
## so use the same Sample and DocSampleIntensity


## Analysis for Decomposition, change experiment to decomposition
## if we want to get the corresponding experiment id, we can use decomposition id to search:
## Experiment.objects.get(id = decomposition.experiment_id)
class DecompositionAnalysis(models.Model):
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=1024)
    decomposition = models.ForeignKey(Decomposition, on_delete=models.CASCADE) ## diff
    group1 = models.CharField(max_length=2048)
    group2 = models.CharField(max_length=2048)
    ready_code, _ = EXPERIMENT_STATUS_CODE[1]
    status = models.CharField(max_length=128, choices=EXPERIMENT_STATUS_CODE,
                              null=True, default=ready_code)
    use_logarithm = models.CharField(max_length=128, choices=[('N', 'No'), ('Y', 'Yes'),],
                              null=True, default='N')

class DecompositionAnalysisResult(models.Model):
    analysis = models.ForeignKey(DecompositionAnalysis, on_delete=models.CASCADE) ## diff
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    pValue = models.FloatField(null=True)
    foldChange = models.FloatField(null=True)

class DecompositionAnalysisResultPlage(models.Model):
    analysis = models.ForeignKey(DecompositionAnalysis, on_delete=models.CASCADE) ## diff
    globalmotif = models.ForeignKey(GlobalMotif, on_delete=models.CASCADE) ## diff
    plage_t_value = models.FloatField(null=True)
    plage_p_value = models.FloatField(null=True)
