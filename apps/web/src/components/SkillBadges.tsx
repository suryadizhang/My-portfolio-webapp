import { Badge } from '@portfolio/ui'

export interface Skill {
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'tools' | 'language'
  proficiency: 'expert' | 'advanced' | 'intermediate'
}

const skills: Skill[] = [
  // Frontend
  { name: 'React.js', category: 'frontend', proficiency: 'expert' },
  { name: 'Next.js', category: 'frontend', proficiency: 'expert' },
  { name: 'TypeScript', category: 'language', proficiency: 'expert' },
  { name: 'JavaScript', category: 'language', proficiency: 'expert' },
  { name: 'Tailwind CSS', category: 'frontend', proficiency: 'expert' },
  { name: 'HTML5', category: 'frontend', proficiency: 'expert' },
  { name: 'CSS3', category: 'frontend', proficiency: 'expert' },
  
  // Backend & Languages
  { name: 'Python', category: 'language', proficiency: 'expert' },
  { name: 'FastAPI', category: 'backend', proficiency: 'expert' },
  { name: 'Flask', category: 'backend', proficiency: 'advanced' },
  { name: 'Node.js', category: 'backend', proficiency: 'advanced' },
  { name: 'Express.js', category: 'backend', proficiency: 'advanced' },
  
  // Databases
  { name: 'PostgreSQL', category: 'database', proficiency: 'expert' },
  { name: 'SQLAlchemy', category: 'database', proficiency: 'expert' },
  { name: 'Prisma', category: 'database', proficiency: 'advanced' },
  { name: 'MongoDB', category: 'database', proficiency: 'intermediate' },
  
  // DevOps & Tools
  { name: 'GitHub Actions', category: 'devops', proficiency: 'expert' },
  { name: 'Docker', category: 'devops', proficiency: 'advanced' },
  { name: 'Vercel', category: 'devops', proficiency: 'expert' },
  { name: 'Git', category: 'tools', proficiency: 'expert' },
  { name: 'OpenAPI/Swagger', category: 'tools', proficiency: 'advanced' },
  { name: 'pytest', category: 'tools', proficiency: 'advanced' },
  { name: 'REST APIs', category: 'backend', proficiency: 'expert' },
  { name: 'CI/CD', category: 'devops', proficiency: 'expert' },
]

const categoryColors = {
  frontend: 'bg-blue-50 text-blue-700 border-blue-200',
  backend: 'bg-purple-50 text-purple-700 border-purple-200',
  database: 'bg-green-50 text-green-700 border-green-200',
  devops: 'bg-orange-50 text-orange-700 border-orange-200',
  tools: 'bg-gray-50 text-gray-700 border-gray-200',
  language: 'bg-linkedin-50 text-linkedin-700 border-linkedin-200',
}

const proficiencyIndicators = {
  expert: '●●●',
  advanced: '●●○',
  intermediate: '●○○',
}

interface SkillBadgesProps {
  categories?: Array<keyof typeof categoryColors>
  showProficiency?: boolean
  limit?: number
  variant?: 'default' | 'compact' | 'detailed'
}

export default function SkillBadges({ 
  categories, 
  showProficiency = false, 
  limit,
  variant = 'default' 
}: SkillBadgesProps) {
  let filteredSkills = skills
  
  if (categories && categories.length > 0) {
    filteredSkills = skills.filter(skill => categories.includes(skill.category))
  }
  
  if (limit) {
    filteredSkills = filteredSkills.slice(0, limit)
  }

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-2">
        {filteredSkills.map((skill) => (
          <Badge 
            key={skill.name} 
            variant="secondary" 
            className={`text-xs ${categoryColors[skill.category]} hover:scale-105 transition-transform`}
          >
            {skill.name}
          </Badge>
        ))}
      </div>
    )
  }

  if (variant === 'detailed') {
    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category]!.push(skill)
      return acc
    }, {} as Record<string, Skill[]>)

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-semibold text-gray-900 capitalize text-sm">
              {category === 'devops' ? 'DevOps' : category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <Badge 
                  key={skill.name} 
                  variant="secondary" 
                  className={`text-xs ${categoryColors[skill.category]} hover:scale-105 transition-transform`}
                  title={`${skill.name} - ${skill.proficiency} level`}
                >
                  {skill.name}
                  {showProficiency && (
                    <span className="ml-1 text-xs opacity-60">
                      {proficiencyIndicators[skill.proficiency]}
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3">
      {filteredSkills.map((skill) => (
        <Badge 
          key={skill.name} 
          variant="secondary" 
          className={`px-3 py-1 ${categoryColors[skill.category]} hover:scale-105 transition-transform font-medium`}
          title={`${skill.name} - ${skill.proficiency} level`}
        >
          {skill.name}
          {showProficiency && (
            <span className="ml-2 text-xs opacity-70">
              {proficiencyIndicators[skill.proficiency]}
            </span>
          )}
        </Badge>
      ))}
    </div>
  )
}

export { skills }