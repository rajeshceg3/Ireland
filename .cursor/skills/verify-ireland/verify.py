#!/usr/bin/env python3
"""Purpose-fit verification for Ireland (tourist map app).

Production build plus the CRA/Jest suites. Exit 0 and FAILURES=0 mean
green.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..'))

checks = []
failures = []


def record(name, ok, detail=''):
    checks.append({'name': name, 'ok': bool(ok), 'detail': detail})
    print(('PASS' if ok else 'FAIL') + ' ' + name + (' :: ' + detail if detail else ''))
    if not ok:
        failures.append(name)


def main():
    npm = shutil.which('npm')
    record('doctor: npm on PATH', npm is not None, npm or 'not found')
    if not npm:
        return finish()

    if not os.path.isdir(os.path.join(REPO_ROOT, 'node_modules')):
        ci = subprocess.run([npm, 'ci', '--no-audit', '--no-fund'], cwd=REPO_ROOT,
                            capture_output=True, text=True, timeout=900)
        record('npm ci', ci.returncode == 0, ci.stderr.strip()[-200:])
        if ci.returncode != 0:
            return finish()

    env = dict(os.environ)
    env['CI'] = 'true'
    test = subprocess.run([npm, 'test', '--', '--watchAll=false'], cwd=REPO_ROOT, env=env,
                          capture_output=True, text=True, timeout=900)
    clean = re.sub(r'\x1b\[[0-9;]*m', '', test.stdout + test.stderr)
    m = re.search(r'Tests:\s+(\d+) passed, (\d+) total', clean)
    record('jest suites green', test.returncode == 0 and m and m.group(1) == m.group(2),
           ('%s/%s tests' % (m.group(1), m.group(2))) if m else clean.strip()[-200:])

    build = subprocess.run([npm, 'run', 'build'], cwd=REPO_ROOT, env=env,
                           capture_output=True, text=True, timeout=900)
    record('production build green', build.returncode == 0 and 'Compiled successfully' in build.stdout,
           (build.stdout.strip().splitlines() or [''])[-1] if build.returncode == 0
           else (build.stdout + build.stderr).strip()[-300:])
    return finish()


def finish():
    evidence_dir = tempfile.mkdtemp(prefix='verify-ireland-')
    with open(os.path.join(evidence_dir, 'evidence.json'), 'w') as f:
        json.dump({'repo': 'Ireland', 'checks': checks, 'failures': failures}, f, indent=2)
    print('EVIDENCE_DIR=' + evidence_dir)
    print('FAILURES=%d' % len(failures))
    return 0 if not failures else 1


if __name__ == '__main__':
    sys.exit(main())
