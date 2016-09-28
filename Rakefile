require "rake/testtask"

Rake::TestTask.new(:test) do |t|
  t.libs << "smells"
  t.libs << "support/ruby"
  t.test_files = FileList[
    "support/ruby/helper.rb",
    "smells/**/*.rb"
  ]
end

task :default => :test
