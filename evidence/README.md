# Evidence

Each folder holds the files of one run of the evaluation. The structure of a run folder and the file names are described in the [evaluation documentation](../evaluation/README.md).

The table shows each run with its type and date, the tag and commit of each implementation that was measured, the Chrome version, and whether the run is valid. The evaluation writes it at the end of each run, from the run information file of each folder (`npm run index` writes it again).

A run is valid when all four parts completed and the Chrome version did not change during the run.

Dry runs, whose names start with `dryrun`, test the scripts. They are not listed in the table and are not committed.

A comparison of two runs (`npm run compare`) writes `compare_<runA>_<runB>.json` in this folder. It is a working file and is not part of the evidence of a run.

<!-- runs:start -->

| Run | Type | Date | Baseline | Accessibility-governed | Chrome | Valid |
| --- | ---- | ---- | -------- | ---------------------- | ------ | ----- |

<!-- runs:end -->
