import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { useTaskDetail, useTestSolution, useUploadSolution } from '../api/hooks'
import type { TestResult } from '../api/types'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import { getErrorMessage } from '../utils/error'

const TaskDetailPage = () => {
  const { taskId } = useParams()
  const { data, isLoading, error } = useTaskDetail(taskId)
  const uploadMutation = useUploadSolution()
  const testMutation = useTestSolution()
  const [file, setFile] = useState<File | null>(null)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
   const [uploadError, setUploadError] = useState<string | null>(null)
   const [testError, setTestError] = useState<string | null>(null)

  const handleUpload = () => {
    if (!file || !taskId) return
    uploadMutation.mutate(
      { taskId, file },
      {
        onSuccess: () => {
          setTestResult(null)
          setUploadError(null)
          setTestError(null)
        },
        onError: (err) => setUploadError(getErrorMessage(err)),
      },
    )
  }

  const handleTest = () => {
    if (!taskId) return
    testMutation.mutate(
      { taskId },
      {
        onSuccess: (result) => setTestResult(result),
        onError: (err: any) => {
          // Try to surface server-provided details, otherwise generic message
          const maybeData = err?.response?.data
          if (maybeData && typeof maybeData === 'object') {
            setTestResult({
              status: maybeData.status || 'Failed',
              formulas_output: maybeData.formulas_output,
              code_output: maybeData.code_output,
              execution_time: maybeData.execution_time,
              code_length: maybeData.code_length,
            } as TestResult)
            setTestError(null)
          } else {
            setTestError(getErrorMessage(err))
          }
        },
      },
    )
  }

  return (
    <div className="grid">
      <Card
        title={data?.name || 'Task'}
        subtitle={data?.description || 'Upload and test your latest solution'}
        action={<span className="pill">// simple helper text: drop your .py file</span>}
      >
        {isLoading && <p className="muted">Loading task...</p>}
        {error && <p className="error-text">{error.message || 'Failed to load task'}</p>}

        <div className="split">
          <div className="glass input-panel">
            <label className="input-label">Upload solution</label>
            <input type="file" accept=".py,.txt" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <div className="row">
              <Button onClick={handleUpload} disabled={!file || uploadMutation.isPending}>
                {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
              </Button>
              <Button variant="ghost" onClick={handleTest} disabled={testMutation.isPending}>
                {testMutation.isPending ? 'Running test...' : 'Test latest'}
              </Button>
            </div>
            {uploadError && <p className="error-text">{uploadError}</p>}
            {testError && <p className="error-text">{testError}</p>}
            {testResult && (
              <div className="mini-card glass">
                <div className="mini-card-top">
                  <Badge tone={testResult.status === 'Success' ? 'success' : 'warning'} label={testResult.status} />
                  <span className="pill">runtime {testResult.execution_time ?? 0}s</span>
                </div>
                <p className="muted">{testResult.formulas_output || testResult.code_output}</p>
              </div>
            )}
          </div>

          <div className="glass input-panel">
            <label className="input-label">Attempts</label>
            {data?.solutions?.length === 0 && <p className="muted">No submissions yet.</p>}
            <div className="stack">
              {data?.solutions?.map((solution) => (
                <div key={solution.id} className="mini-card glass">
                  <div className="mini-card-top">
                    <Badge tone={solution.status === 'Success' ? 'success' : 'warning'} label={solution.status} />
                    <span className="pill">#{solution.id}</span>
                  </div>
                  <pre className="code-snippet">{solution.code.slice(0, 120)}...</pre>
                  <p className="muted">{solution.is_hidden ? 'Hidden' : 'Visible to teacher'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TaskDetailPage
