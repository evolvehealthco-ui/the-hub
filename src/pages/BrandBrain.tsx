import { useState } from 'react'
import {
  User,
  MessageSquare,
  Users,
  Compass,
  Gift,
  Award,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'identity', label: 'Brand Identity', icon: User },
  { id: 'voice', label: 'Voice & Tone', icon: MessageSquare },
  { id: 'audience', label: 'Audience Profiles', icon: Users },
  { id: 'pillars', label: 'Content Pillars', icon: Compass },
  { id: 'offers', label: 'Offers & Products', icon: Gift },
  { id: 'proof', label: 'Proof & Credentials', icon: Award },
  { id: 'samples', label: 'Sample Content', icon: FileText },
]

export function BrandBrain() {
  const [activeTab, setActiveTab] = useState('identity')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-near-black">Brand Brain</h1>
        <p className="text-sm text-gray-500 mt-1">Your brand identity, voice, audience, and content DNA</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1.5 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'bg-brand-rose/10 text-brand-deep-rose'
                : 'text-gray-500 hover:bg-gray-50'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        {activeTab === 'identity' && <IdentityTab />}
        {activeTab === 'voice' && <VoiceTab />}
        {activeTab === 'audience' && <AudienceTab />}
        {activeTab === 'pillars' && <PillarsTab />}
        {activeTab === 'offers' && <OffersTab />}
        {activeTab === 'proof' && <ProofTab />}
        {activeTab === 'samples' && <SamplesTab />}
      </div>
    </div>
  )
}

function FormField({ label, type = 'text', placeholder, value, rows }: {
  label: string; type?: string; placeholder?: string; value?: string; rows?: number
}) {
  const base = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal/30 bg-brand-cream/30'
  return (
    <div>
      <label className="block text-sm font-medium text-brand-near-black mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea className={cn(base, 'resize-none')} placeholder={placeholder} defaultValue={value} rows={rows || 4} />
      ) : (
        <input type={type} className={base} placeholder={placeholder} defaultValue={value} />
      )}
    </div>
  )
}

function SaveButton() {
  return (
    <button className="px-6 py-2.5 bg-brand-rose text-white rounded-lg text-sm font-medium hover:bg-brand-deep-rose transition-colors">
      Save Changes
    </button>
  )
}

function IdentityTab() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg font-semibold text-brand-near-black">Brand Identity</h2>
      <FormField label="Business Name" value="Elizabeth Campbell" placeholder="Your business or brand name" />
      <FormField label="Tagline" value="Wellness isn't a destination â it's how you show up every day." placeholder="Your core message in one line" />
      <FormField label="Origin Story" type="textarea" rows={5}
        value="Former corporate burnout turned holistic health advocate. After transforming my own relationship with fitness, nutrition, and mindset, I now help other women build sustainable wellness practices rooted in science and self-compassion."
        placeholder="How did you get here? What drives you?" />
      <FormField label="Mission" type="textarea" rows={3}
        value="Make fitness accessible, science-backed, and judgment-free for women at every stage of their journey."
        placeholder="Why does your business exist?" />
      <FormField label="Values" type="textarea" rows={3}
        value="Evidence over trends. Community over competition. Progress over perfection. Showing up over showing off."
        placeholder="What do you stand for?" />
      <FormField label="Brand Personality Keywords" placeholder="Warm, direct, evidence-based, encouraging, no-BS, real"
        value="Warm, direct, evidence-based, encouraging, no-BS, real" />
      <div className="pt-2"><SaveButton /></div>
    </div>
  )
}

function VoiceTab() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg font-semibold text-brand-near-black">Voice & Tone Rules</h2>
      <FormField label="Signature Phrases" type="textarea" rows={3}
        value={"Here's the thing...\nLet me be real with you...\nThis isn't about perfection â it's about showing up."}
        placeholder="Phrases you use regularly (one per line)" />
      <FormField label="Language to Use" type="textarea" rows={3}
        value="Second person ('you'), conversational, direct, action-oriented. Short punchy sentences mixed with longer flowing ones."
        placeholder="How you want to sound" />
      <FormField label="Language to Avoid" type="textarea" rows={3}
        value="Jargon, 'just' (minimizing), 'guilty pleasure', diet culture language, toxic positivity, condescending tone"
        placeholder="Words and tones to stay away from" />
      <FormField label="Sentence Style" type="textarea" rows={2}
        value="Short punchy sentences mixed with longer flowing ones. Start paragraphs with bold statements. Use line breaks for pacing."
        placeholder="How you structure sentences" />
      <FormField label="Emotional Tone" type="textarea" rows={2}
        value="Like a smart friend who's been through it â not a lecturer, not a cheerleader. Warm but direct."
        placeholder="The feeling your content should create" />
      <div className="pt-2"><SaveButton /></div>
    </div>
  )
}

function AudienceTab() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-brand-near-black">Audience Profiles</h2>
        <button className="text-sm text-brand-teal hover:text-brand-teal/80 font-medium">+ Add Profile</button>
      </div>

      {/* Profile 1 */}
      <div className="border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-brand-near-black">Beginner Women</h3>
          <span className="text-xs bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full">Default</span>
        </div>
        <FormField label="Demographics" value="Women 25-40, urban/suburban, health-curious but overwhelmed" />
        <FormField label="Pain Points" type="textarea" rows={2}
          value="Overwhelmed by fitness info, inconsistent with routines, don't know where to start, tired of starting and stopping" />
        <FormField label="Aspirations" type="textarea" rows={2}
          value="Feel strong and confident, have a clear plan, belong to a community, stop second-guessing themselves" />
        <FormField label="Language They Use" type="textarea" rows={2}
          value="'I don't know what I'm doing.' 'I always start and stop.' 'I just want someone to tell me what to do.'" />
      </div>

      {/* Profile 2 */}
      <div className="border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-brand-near-black">Postpartum Moms</h3>
        <FormField label="Demographics" value="Women 28-38, 0-2 years postpartum" />
        <FormField label="Pain Points" type="textarea" rows={2}
          value="Body feels unfamiliar, no time, guilt about self-care, pressure to 'bounce back'" />
        <FormField label="Aspirations" type="textarea" rows={2}
          value="Feel like themselves again, sustainable routine, grace with the process" />
        <FormField label="Language They Use" type="textarea" rows={2}
          value="'I just want to feel like me again.' 'I have zero time.' 'Everyone says to rest but I feel stuck.'" />
      </div>

      <SaveButton />
    </div>
  )
}

function PillarsTab() {
  const pillars = [
    { name: 'Health & Wellness', description: 'Fitness, nutrition, recovery, evidence-based health practices', ratio: 40, color: '#B5606B' },
    { name: 'Personal Transformation', description: 'Mindset, habits, identity shifts, growth stories', ratio: 25, color: '#3D8E96' },
    { name: 'Community & Connection', description: 'Events, group activities, building real relationships', ratio: 15, color: '#8B3A46' },
    { name: 'Lifestyle & Travel', description: 'Daily routines, solo dates, travel, living fully', ratio: 20, color: '#6B7280' },
  ]

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-brand-near-black">Content Pillars</h2>
        <button className="text-sm text-brand-teal hover:text-brand-teal/80 font-medium">+ Add Pillar</button>
      </div>
      {pillars.map(pillar => (
        <div key={pillar.name} className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pillar.color }} />
            <h3 className="font-medium text-brand-near-black">{pillar.name}</h3>
            <span className="text-xs text-gray-400 ml-auto">{pillar.ratio}%</span>
          </div>
          <p className="text-sm text-gray-500">{pillar.description}</p>
        </div>
      ))}
      <SaveButton />
    </div>
  )
}

function OffersTab() {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-brand-near-black">Offers & Products</h2>
        <button className="text-sm text-brand-teal hover:text-brand-teal/80 font-medium">+ Add Offer</button>
      </div>
      {[
        { name: 'Free Glute Guide', type: 'Lead Magnet', price: 'Free', status: 'Active', cta: 'Download Now' },
        { name: '12-Week Coaching Program', type: '1:1 Coaching', price: '$$$', status: 'Active', cta: 'Book Your Call' },
        { name: 'Weekend Wellness Retreats', type: 'In-Person Event', price: '$$', status: 'Seasonal', cta: 'Reserve Your Spot' },
      ].map(offer => (
        <div key={offer.name} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-brand-near-black">{offer.name}</h3>
            <p className="text-sm text-gray-500">{offer.type} &middot; {offer.price}</p>
            <p className="text-xs text-gray-400 mt-1">CTA: {offer.cta}</p>
          </div>
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full font-medium',
            offer.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
          )}>{offer.status}</span>
        </div>
      ))}
      <SaveButton />
    </div>
  )
}

function ProofTab() {
  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-lg font-semibold text-brand-near-black">Proof & Credentials</h2>
      <FormField label="Certifications" type="textarea" rows={3}
        value="NASM-CPT (Certified Personal Trainer)\nNutrition Coaching Certification\nBreathwork Facilitator Training"
        placeholder="List your certifications (one per line)" />
      <FormField label="Key Stats" type="textarea" rows={2}
        value="500+ women coached\n3+ years of consistent content creation\n72K+ words of analyzed brand content"
        placeholder="Impressive numbers that build credibility" />
      <FormField label="Client Testimonials" type="textarea" rows={4}
        placeholder="Paste testimonials the AI can reference or paraphrase" />
      <FormField label="Research Sources You Cite" type="textarea" rows={3}
        placeholder="Journals, books, experts you frequently reference" />
      <SaveButton />
    </div>
  )
}

function SamplesTab() {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-brand-near-black">Sample Content</h2>
        <button className="text-sm text-brand-teal hover:text-brand-teal/80 font-medium">+ Add Sample</button>
      </div>
      <p className="text-sm text-gray-500">Upload 5-10 of your best-performing pieces. The AI uses these as style references.</p>

      <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">
        <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Paste or upload content samples</p>
        <p className="text-xs text-gray-400 mt-1">Reel scripts, carousels, emails, ebook excerpts</p>
      </div>

      <SaveButton />
    </div>
  )
}
