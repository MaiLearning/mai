import {
  CheckCircle2,
  ChevronRight,
  Circle,
  FileText,
  Folder,
  FolderOpen,
  ListChecks,
  PenLine,
  Play,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { ProgressFill, ProgressTrack } from '@/app/theme/components/Progress'
import { type Course, type CourseNode, courseProgress, type LessonType } from './course.data'
import {
  CloseButton,
  CourseTitle,
  Overlay,
  ProgressBox,
  Scroll,
  Sidebar,
  SideHeader,
  SideTop,
  TreeList,
  TreeRow,
} from './course.styles'

const icons: Record<LessonType, typeof Play> = {
  video: Play,
  reading: FileText,
  exercise: PenLine,
  quiz: ListChecks,
}
interface Props {
  course: Course
  activeId: string
  open: boolean
  onClose: () => void
  onSelect: (id: string) => void
}
function Node({
  node,
  depth,
  activeId,
  onSelect,
}: {
  node: CourseNode
  depth: number
  activeId: string
  onSelect: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const folder = Boolean(node.children?.length)
  const Icon = !folder ? icons[node.type as LessonType] : null
  return (
    <li>
      <TreeRow
        $depth={depth}
        $selected={node.id === activeId}
        $folder={folder}
        $done={node.status === 'done'}
        onClick={() => (folder ? setExpanded(!expanded) : onSelect(node.id))}
        aria-current={node.id === activeId ? 'page' : undefined}
      >
        {folder ? (
          expanded ? (
            <ChevronRight size={15} style={{ transform: 'rotate(90deg)' }} />
          ) : (
            <ChevronRight size={15} />
          )
        ) : (
          <span style={{ width: 15 }} />
        )}
        {folder ? (
          expanded ? (
            <FolderOpen size={16} />
          ) : (
            <Folder size={16} />
          )
        ) : node.status === 'done' ? (
          <CheckCircle2 size={16} />
        ) : node.status === 'current' && Icon ? (
          <Icon size={16} />
        ) : (
          <Circle size={15} />
        )}
        <span className="title">{node.title}</span>
        {!folder && <span className="duration">{node.duration}</span>}
      </TreeRow>
      {folder && expanded && (
        <TreeList>
          {node.children?.map((child) => (
            <Node
              key={child.id}
              node={child}
              depth={depth + 1}
              activeId={activeId}
              onSelect={onSelect}
            />
          ))}
        </TreeList>
      )}
    </li>
  )
}

export function CourseSidebar({ course: value, activeId, open, onClose, onSelect }: Props) {
  const progress = courseProgress(value)
  return (
    <>
      <Overlay $open={open} onClick={onClose} aria-label="Закрыть содержание курса" />
      <Sidebar $open={open} aria-label="Содержание курса">
        <SideHeader>
          <SideTop>
            <strong>Mai</strong>
            <CloseButton onClick={onClose} aria-label="Закрыть меню">
              <X size={18} />
            </CloseButton>
          </SideTop>
          <div>
            <CourseTitle>{value.title}</CourseTitle>
            <ProgressBox>
              <div className="row">
                <span>{progress.percent}% завершено</span>
                <span>
                  {progress.done}/{progress.total} уроков
                </span>
              </div>
              <ProgressTrack>
                <ProgressFill $percent={progress.percent} />
              </ProgressTrack>
            </ProgressBox>
          </div>
        </SideHeader>
        <Scroll>
          <TreeList>
            {value.root.map((node) => (
              <Node key={node.id} node={node} depth={0} activeId={activeId} onSelect={onSelect} />
            ))}
          </TreeList>
        </Scroll>
      </Sidebar>
    </>
  )
}
