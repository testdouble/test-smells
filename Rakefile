require "rake/testtask"

Rake::TestTask.new(:test) do |t|
  t.libs << "smells"
  t.libs << "support/ruby"
  tests = ARGV[1] || "smells/**/*.rb"
  t.test_files = FileList[
    "support/ruby/helper.rb",
    tests
  ]
end

task :default => :test
