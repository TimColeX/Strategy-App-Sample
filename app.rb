require 'sinatra'
require 'json'
require_relative 'database'

set :port, 4567
set :bind, '0.0.0.0'

before do
  content_type :json
end

# 1. Health Check
get '/health' do
  { status: 'ok', system: 'Strategy Management System' }.to_json
end

# 2. List Strategy Versions
get '/strategies' do
  sql = "SELECT id, name, status, valid_from, valid_to FROM strategy_versions ORDER BY created_at DESC"
  result = DB.query(sql)
  result.map { |row| row }.to_json
end

# 3. Get Full Strategy Canvas (Hierarchy)
get '/strategies/:id/canvas' do
  strategy_id = params[:id]

  # Fetch Themes
  themes_sql = "SELECT id, title, description, weighting FROM strategic_themes WHERE strategy_version_id = $1"
  themes = DB.query(themes_sql, [strategy_id]).map { |row| row }

  # Enrich themes with Objectives
  themes.each do |theme|
    objs_sql = "SELECT id, title, statement, metric_type FROM objectives WHERE theme_id = $1"
    theme['objectives'] = DB.query(objs_sql, [theme['id']]).map { |row| row }
  end

  { strategy_id: strategy_id, canvas: themes }.to_json
end

# 4. Impact Analysis (Graph Traversal)
get '/assumptions/:id/impact' do
  assumption_id = params[:id]
  
  sql = <<~SQL
    SELECT 
      aim.entity_type,
      aim.entity_id,
      aim.impact_severity,
      CASE 
        WHEN aim.entity_type = 'initiative' THEN (SELECT title FROM initiatives WHERE id = aim.entity_id)
        WHEN aim.entity_type = 'theme' THEN (SELECT title FROM strategic_themes WHERE id = aim.entity_id)
      END as entity_name
    FROM assumption_impact_map aim
    WHERE aim.assumption_id = $1
  SQL

  impacts = DB.query(sql, [assumption_id]).map { |row| row }
  { assumption_id: assumption_id, impacts: impacts }.to_json
end
