# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2019-11-27 13:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('basicviz', '0089_experiment_include_motifset'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='metadata',
            field=models.CharField(max_length=4096, null=True),
        ),
        migrations.AlterField(
            model_name='document',
            name='name',
            field=models.CharField(max_length=1028),
        ),
    ]
