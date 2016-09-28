#! /usr/bin/env ruby

require 'pry'
require 'fileutils'

Dir[glob_pattern = ARGV[0]].each do |f|
  next unless File.file?(f)
  name = File.basename(f, ".*")
  new_dir = File.join(File.dirname(f), name)
  FileUtils.mkdir_p(new_dir)
  FileUtils.mv(f, new_dir)
  puts "Moved #{f} to #{new_dir}"

  human_name = name.split("-").map(&:capitalize).join(" ")
  File.open(File.join(new_dir, "README.md"), "w") do |readme|
    readme.write <<-README.gsub(/^ {6}/,'')
      # Test Smell: #{human_name}

      ## Odor Emitted

      ## Known Causes

      ## About this Example

      ### Description

      ### Challenge

      ## Language-specific Notes

      ### Ruby

      ### JavaScript

      ## Additional Resources

    README
    puts "created README for #{name}"
  end
end
